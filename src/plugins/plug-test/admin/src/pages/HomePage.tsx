import { Main } from "@strapi/design-system";
import { useIntl } from "react-intl";

import { getTranslation } from "../utils/getTranslation";
import PaymentForm, { PaymentFormData } from "../components/paymentForm";

const HomePage = () => {
  const { formatMessage } = useIntl();

  const handlePayment = (data: PaymentFormData) => {
    console.log("Payment data:", data);
    // TODO: send data to your Strapi payment plugin API
  };

  return (
    <Main>
      <h1>this is test plugin</h1>
      {/* <PaymentForm onSubmit={handlePayment} />       */}
    </Main>
  );
};

export { HomePage };