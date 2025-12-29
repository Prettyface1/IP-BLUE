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
    (asserts! (is-valid-title title) ERR-INVALID-INPUT)
    (asserts! (is-valid-description description) ERR-INVALID-INPUT)
    (map-set ip-registry {ip-id: ip-id} {creator: tx-sender, title: title, description: description, total-shares: total-shares, base-price: base-price, license-type: license-type})
    (map-set ip-ownership {ip-id: ip-id, owner: tx-sender} {shares: total-shares})
    (var-set next-ip-id (+ ip-id u1))
    (ok ip-id)))

;; Transfer IP ownership shares
(define-public (transfer-ip-shares (ip-id uint) (recipient principal) (shares uint))
  (let ((sender-shares (default-to u0 (get shares (map-get? ip-ownership {ip-id: ip-id, owner: tx-sender})))))
    (asserts! (>= sender-shares shares) ERR-INSUFFICIENT-BALANCE)
    (map-set ip-ownership {ip-id: ip-id, owner: tx-sender} {shares: (- sender-shares shares)})
    (map-set ip-ownership {ip-id: ip-id, owner: recipient} {shares: (+ (default-to u0 (get shares (map-get? ip-ownership {ip-id: ip-id, owner: recipient}))) shares)})
    (ok true)))

;; Calculate royalty amount
(define-read-only (get-royalty-amount (ip-id uint) (base-price uint))
  (let ((ip-details (unwrap! (map-get? ip-registry {ip-id: ip-id}) (ok u0))))
    (ok (/ (* base-price u5) u100)))) ;; Default 5% royalty

