import React from "react";
import Layout from "../component/Layout";
import { useSearch } from "../context/search";

const Search = () => {
  const [values, setValues] = useSearch();
  return (
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Result</h1>
          <h3>
            {values?.results.length < 1
              ? "No product found"
              : `Found ${values?.results.length}`}
          </h3>
          <div className="d-flex flex-wrap">
            {values?.results.map((p) => {
              return (
                <div
                  className="card m-2 "
                  style={{ width: "18rem" }}
                  key={p._id}
                >
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">
                      {p.description.substring(0, 30)}...
                    </p>
                    <p className="card-text">Rs: {p.price}</p>
                    <button className="btn btn-info ms-1">See Details</button>
                    <button className="btn btn-primary ms-1">
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
