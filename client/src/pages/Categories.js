import React from "react";
import Layout from "../component/Layout";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";

const Categories = () => {
  const categories = useCategory();
  return (
    <Layout title={"All Categories"}>
      <div className="container">
        <div className="row">
          {categories.map((c) => {
            return (
              <div className="col-md-6 mt-3 mb-2" key={c._id}>
                <Link
                  to={`/category/${c.slug}`}
                  className="btn btn-primary m-2"
                >
                  {c.name}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
