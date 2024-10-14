import React from "react";
import Layout from "../component/Layout";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

const PageNotFound = () => {
  return (
    <Layout title={"Page Not Found - Ecommerce App"}>
      <div className="pnf">
        <h1 className="pnf-title">404</h1>
        <h2 className="pnf-heading">Oops! Page Not Found</h2>
        <Link to="/" className="pnf-btn">
          <MdOutlineKeyboardArrowLeft size={32} />
          Go Home
        </Link>
      </div>
    </Layout>
  );
};

export default PageNotFound;
