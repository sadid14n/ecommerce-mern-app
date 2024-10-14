import React from "react";
import Layout from "../component/Layout";
const Contact = () => {
  return (
    <Layout>
      <div className="row contact m-4">
        <div className="col-md-6">
          <img src="/images/contact.jpg" alt="" style={{ width: "100%" }} />
        </div>
        <div className="col-md-4">
          <h1 className="text-center pt-3">Contact Us</h1>
          <p className="text-justify mt-3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex amet vel
            labore cum eligendi!
          </p>
          <p className="mt-3">www.help@ecommerce.com</p>
          <p className="mt-3">+91 1234567890</p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
