import moment from "moment";
import { useEffect, useState } from "react";
import axios from "axios";
import TitleCard from "../../../components/Cards/TitleCard";

function Billing() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/get-all-payment"
        );
        setBills(res.data); // assuming res.data is the array of payments
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  const getPaymentStatus = (amount) => {
    if (amount > 0) return <div className="badge badge-success">Paid</div>;
    else return <div className="badge badge-primary">Pending</div>;
  };

  return (
    <div>
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Citizen Name</th>
              <th>Email</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill, index) => (
              <tr key={index}>
                <td>{bill._id}</td>
                <td>
                  {bill.citizen_id?.first_name} {bill.citizen_id?.middle_name}{" "}
                  {bill.citizen_id?.last_name}
                </td>
                <td>{bill.citizen_id?.email}</td>
                <td>{bill.service_id?.name}</td>
                <td>
                  {bill.amount_paid} {bill.currency}
                </td>
                <td>{getPaymentStatus(bill.amount_paid)}</td>
                <td>{moment(bill.payment_date).format("DD MMM YYYY")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Billing;
