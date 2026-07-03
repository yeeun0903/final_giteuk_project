import alertIcon from "../../assets/Payment_completed/alert-circle.png";
import closeIcon from "../../assets/Payment_completed/Button_close.png";

export default function PaymentCompleted({
  isOpen,
  productName,
  paymentAmount,
  onClose,
  onContinue,
  onHome,
}) {
  if (!isOpen) return null;

  return (
    <div className="payment-completed-overlay" role="presentation">
      <section
        className="payment-completed-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-completed-title"
      >
        <button
          id="btn-groupbuy_payment-popup_close"
          className="payment-completed-close-button"
          type="button"
          aria-label="닫기"
          data-event="click_close"
          data-page="groupbuy_payment"
          data-section="payment_popup"
          data-action="close"
          data-label="payment_popup"
          onClick={onClose}
        >
          <img src={closeIcon} alt="" aria-hidden="true" />
        </button>

        <div className="payment-completed-message">
          <img src={alertIcon} alt="" aria-hidden="true" />
          <h2 id="payment-completed-title">결제요청이 완료되었습니다.</h2>
        </div>

        <div className="payment-completed-details">
          <div className="payment-completed-detail-row">
            <span>상품명</span>
            <strong>{productName}</strong>
          </div>
          <div className="payment-completed-divider" />
          <div className="payment-completed-detail-row">
            <span>결제요청금액</span>
            <strong>{paymentAmount}</strong>
          </div>
          <div className="payment-completed-divider" />
        </div>

        <div className="payment-completed-actions">
          <button
            id="btn-groupbuy_payment-popup_continue"
            className="payment-completed-continue-button"
            type="button"
            data-event="click_continue"
            data-page="groupbuy_payment"
            data-section="payment_popup"
            data-action="continue"
            data-label="payment_popup"
            onClick={onContinue}
          >
            이어서 요청하기
          </button>
          <button
            id="btn-groupbuy_payment-popup_home"
            className="payment-completed-home-button"
            type="button"
            data-event="click_home"
            data-page="groupbuy_payment"
            data-section="payment_popup"
            data-action="home"
            data-label="payment_popup"
            onClick={onHome}
          >
            홈으로
          </button>
        </div>
      </section>
    </div>
  );
}
