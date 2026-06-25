import { Router } from 'express';
import {
  createReservation,
  getMyReservations,
  getAllReservations,
  getReservationById,
  updateReservationStatus,
  deleteReservation,
  getAvailableSlots,
  getReservationByConfirmationCode,
} from '../controllers/reservation.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

// ─── Public Routes ────────────────────────────────────────────────────────────

// @route  POST /api/v1/reservations
// @desc   Create a new reservation (no auth required)
router.post('/', createReservation);

// @route  GET /api/v1/reservations/available-slots
// @desc   Get available reservation slots
router.get('/available-slots', getAvailableSlots);

// @route  GET /api/v1/reservations/confirm/:code
// @desc   Get reservation by confirmation code
router.get('/confirm/:code', getReservationByConfirmationCode);

// ─── Authenticated Customer Routes ───────────────────────────────────────────

// @route  GET /api/v1/reservations/my-reservations
// @desc   Get logged-in user's reservations
router.get('/my-reservations', requireAuth, getMyReservations);

// ─── Admin/Owner Routes ───────────────────────────────────────────────────────

// @route  GET /api/v1/reservations
// @desc   Get all reservations (admin/owner)
router.get('/', requireAuth, requireRole('admin', 'owner'), getAllReservations);

// ─── Shared Authenticated Routes ─────────────────────────────────────────────

// @route  GET /api/v1/reservations/:id
// @desc   Get a single reservation by ID
router.get('/:id', requireAuth, getReservationById);

// @route  PATCH /api/v1/reservations/:id/status
// @desc   Update reservation status (admin/owner)
router.patch('/:id/status', requireAuth, requireRole('admin', 'owner'), updateReservationStatus);

// @route  DELETE /api/v1/reservations/:id
// @desc   Delete/cancel a reservation
router.delete('/:id', requireAuth, deleteReservation);

export default router;
