;; IP-BLUE: Integrated Protocol BLUE
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-UNAUTHORIZED (err u100))
(define-constant ERR-INVALID-IP (err u101))
(define-constant ERR-ALREADY-EXISTS (err u102))
(define-constant ERR-NOT-FOUND (err u103))
(define-constant ERR-INSUFFICIENT-BALANCE (err u104))
(define-constant ERR-INVALID-INPUT (err u105))

;; Register a new IP asset
(define-public (register-ip (title (string-ascii 100)) (description (string-ascii 500)) (total-shares uint) (base-price uint) (license-type (string-ascii 50)))
  (let ((ip-id (var-get next-ip-id)))
