import React, { useEffect, useState } from "react";
import Usernavebar from "./usernavebar";
import './UserDashboard.css';
import {
  useGetuserdetailsQuery,
  useLazyGetuserdetailsQuery,
  usePaymentloanMutation,
} from "../../APISERVER/lmsAPI";

export default function Userdashbord() {
  var { isLoading, data } = useGetuserdetailsQuery();
  console.log(isLoading, data);
  var [paidemi, setpaidemi] = useState(0);
  var [unpaidemi, setunpaidemi] = useState(0);
  var [paymentfn] = usePaymentloanMutation();
  var [paylazyfn] = useLazyGetuserdetailsQuery();
  function payment(loanid, emiid) {
    console.log(loanid, emiid);
    paymentfn({ loanid: loanid, emiid: emiid }).then((res) => {
      console.log(res);
      paylazyfn().then((r) => {
        console.log(r);
      });
    });
  }
  const totalPaid =
    !isLoading &&
    data?.emis
      .filter((s) => s.emiStatus === "paid")
      .reduce((acc, emi) => acc + emi.emiAmount, 0);


  const totalUnpaid =
    !isLoading &&
    data?.emis
      .filter((s) => s.emiStatus !== "paid")
      .reduce((acc, emi) => acc + emi.emiAmount, 0);
  const totalpayment =
    !isLoading && data?.emis.reduce((acc, emi) => acc + emi.emiAmount, 0);

  useEffect(() => {
    var paid = 0;
    var UnPaid = 0;
    !isLoading &&
      data?.emis.forEach((s) => {
        if (s.emiStatus === "paid") {
          paid = paid + 1;
        } else {
          UnPaid = UnPaid + 1;
        }
      });
    setpaidemi(paid);
    setunpaidemi(UnPaid);
  }, [data]);
  return (
    <div className="user-dashboard bg-light min-vh-100">
      <Usernavebar />
      <div className="container py-4">
        <div className="row align-items-center mb-4">
          <div className="col-12 col-md-8">
            <h1 className="dashboard-title">User Dashboard</h1>
          </div>
          <div className="col-12 col-lg-4 justify-content-end">
            <div className="row row-cols-2">
              <div className="col">
                <div className="stat-card d-flex justify-content-between align-items-center">
                  <span className="stat-label">Paid EMIs</span>
                  <span className="stat-value">{paidemi}</span>
                </div>
              </div>
              <div className="col">
                <div className="stat-card d-flex justify-content-between align-items-center">
                  <span className="stat-label w-75">Unpaid EMIs</span>
                  <span className="stat-value">{unpaidemi}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="card dashboard-card h-100">
              <div className="card-body">
                <h2 className="card-title mb-4">Payment Details</h2>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr className="text-center">
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>EMI Amount</th>
                        <th className="d-flex flex-1 d-md-none h-100">Status</th>
                        <th>Due Date</th>
                        <th className="d-none d-md-block">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {!isLoading &&
                        (() => {
                          const firstUnpaidIndex = data?.emis.findIndex(
                            (emi) => emi.emiStatus !== "paid"
                          );

                          return data?.emis.map((emis, index) => (
                            <tr key={emis._id} className="text-center">
                              <td>₹{emis.Principal}</td>
                              <td>₹{emis.Interest}</td>
                              <td>₹{emis.emiAmount}</td>
                              <td className="d-block d-md-none">
                                {emis.emiStatus === "paid" ? (
                                  <span className="status-badge paid">
                                    Paid
                                  </span>
                                ) : index === firstUnpaidIndex ? (
                                  <button
                                    className="btn btn-primary btn-sm pay-btn"
                                    onClick={() => payment(data?._id, emis._id)}
                                  >
                                    Pay Now
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-secondary btn-sm"
                                    disabled
                                  >
                                    Pending
                                  </button>
                                )}
                              </td>
                              <td>
                                {new Date(emis.emiDate).toLocaleDateString()}
                              </td>
                              <td className="d-none d-md-flex">
                                {emis.emiStatus === "paid" ? (
                                  <span className="status-badge paid">
                                    Paid
                                  </span>
                                ) : index === firstUnpaidIndex ? (
                                  <button
                                    className="btn btn-primary btn-sm pay-btn"
                                    onClick={() => payment(data?._id, emis._id)}
                                  >
                                    Pay Now
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-secondary btn-sm"
                                    disabled
                                  >
                                    Pending
                                  </button>
                                )}
                              </td>
                            </tr>
                          ));
                        })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card dashboard-card h-100">
              <div className="card-body">
                <h2 className="card-title mb-4">Payment Summary</h2>
                <div className="d-flex justify-content-between align-items-center my-3">
                  <span className="fs-5">Total Payment</span>
                  <span className="amount">₹{totalpayment || 0}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center my-3">
                  <span className="fs-5">Total Paid</span>
                  <span className="amount paid">₹{totalPaid || 0}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center my-3">
                  <span className="fs-5">Total Unpaid</span>
                  <span className="amount unpaid">₹{totalUnpaid || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
