import { Request, Response, NextFunction } from 'express';
import Reservation from '../models/Reservation';
import { sendReservationConfirmationEmail } from '../utils/sendEmail';

// ─── Create Reservation ──────────────────────────────────────────────────────
export const createReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      date,
      time,
      guests,
      occasion = 'other',
      specialRequests,
    } = req.body;

    if (!name || !email || !phone || !date || !time || !guests) {
      res.status(400).json({
        success: false,
        message: 'Name, email, phone, date, time, and guests are required',
      });
      return;
    }

    // Check table availability (max 10 reservations per time slot)
    const checkDate = new Date(date);
    const startOfDay = new Date(checkDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(checkDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingCount = await Reservation.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      time,
      status: { $ne: 'cancelled' },
    });

    if (existingCount >= 10) {
      res.status(400).json({
        success: false,
        message: 'This time slot is fully booked. Please select a different time or date.',
      });
      return;
    }

    // Attach user ID if logged in
    const userId = req.user ? req.user._id : undefined;

    const reservation = await Reservation.create({
      user: userId,
      name,
      email,
      phone,
      date: startOfDay,
      time,
      guests,
      occasion,
      specialRequests,
    });

    // Send confirmation email
    sendReservationConfirmationEmail(reservation.email, reservation.name, {
      confirmationCode: reservation.confirmationCode,
      date: reservation.date,
      time: reservation.time,
      guests: reservation.guests,
      occasion: reservation.occasion,
      specialRequests: reservation.specialRequests,
    })
      .then(async () => {
        reservation.emailSent = true;
        await reservation.save();
      })
      .catch((err) => {
        console.error('Failed to send reservation confirmation email:', err);
      });

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: reservation,
    });
  } catch (error: any) {
    console.error('Create reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating reservation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── Get My Reservations ─────────────────────────────────────────────────────
export const getMyReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reservations = await Reservation.find({ user: req.user!._id }).sort({
      date: -1,
      time: 1,
    });

    res.status(200).json({
      success: true,
      data: reservations,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching reservations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── Get All Reservations (Admin/Owner) ───────────────────────────────────────
export const getAllReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = '1', limit = '10', date, status } = req.query as Record<
      string,
      string
    >;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};
    if (status) query.status = status;
    if (date) {
      const checkDate = new Date(date);
      const start = new Date(checkDate);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(checkDate);
      end.setUTCHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const [reservations, total] = await Promise.all([
      Reservation.find(query)
        .sort({ date: 1, time: 1 })
        .skip(skip)
        .limit(limitNum)
        .populate('user', 'name email phone')
        .lean(),
      Reservation.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: reservations,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching reservations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── Get Reservation By ID ───────────────────────────────────────────────────
export const getReservationById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id).populate(
      'user',
      'name email phone'
    );

    if (!reservation) {
      res.status(404).json({ success: false, message: 'Reservation not found' });
      return;
    }

    const isOwner =
      reservation.user &&
      reservation.user._id.toString() === req.user!._id.toString();
    const isClientEmail = reservation.email === req.user!.email;
    const isAdmin = ['admin', 'owner'].includes(req.user!.role);

    if (!isOwner && !isClientEmail && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view this reservation',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching reservation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── Update Reservation Status (Admin/Owner) ─────────────────────────────────
export const updateReservationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, tableNumber, notes } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (status && !validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      res.status(404).json({ success: false, message: 'Reservation not found' });
      return;
    }

    if (status) reservation.status = status;
    if (tableNumber !== undefined) reservation.tableNumber = tableNumber;
    if (notes !== undefined) reservation.notes = notes;

    await reservation.save();

    res.status(200).json({
      success: true,
      message: 'Reservation updated successfully',
      data: reservation,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error updating reservation status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── Get Available Slots ─────────────────────────────────────────────────────
export const getAvailableSlots = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { date, guests } = req.query;

    if (!date) {
      res.status(400).json({ success: false, message: 'Date is required' });
      return;
    }

    const checkDate = new Date(date as string);
    const startOfDay = new Date(checkDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(checkDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingReservations = await Reservation.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'cancelled' },
    });

    const mockSlots = ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'];
    
    const slotCounts: Record<string, number> = {};
    existingReservations.forEach(r => {
      slotCounts[r.time] = (slotCounts[r.time] || 0) + 1;
    });

    const availableSlots = mockSlots.filter(slot => (slotCounts[slot] || 0) < 10);

    res.status(200).json({
      success: true,
      slots: availableSlots,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching available slots',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── Get Reservation By Confirmation Code ────────────────────────────────────
export const getReservationByConfirmationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code } = req.params;
    const reservation = await Reservation.findOne({ confirmationCode: code });

    if (!reservation) {
      res.status(404).json({ success: false, message: 'Reservation not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching reservation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── Delete/Cancel Reservation ───────────────────────────────────────────────
export const deleteReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      res.status(404).json({ success: false, message: 'Reservation not found' });
      return;
    }

    const isOwner =
      reservation.user &&
      reservation.user.toString() === req.user!._id.toString();
    const isClientEmail = reservation.email === req.user!.email;
    const isAdmin = ['admin', 'owner'].includes(req.user!.role);

    if (!isOwner && !isClientEmail && !isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this reservation',
      });
      return;
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.status(200).json({
      success: true,
      message: 'Reservation cancelled successfully',
      data: reservation,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error cancelling reservation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
