import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { set } from "mongoose";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    if (params?.slug) getProductByCategory();
  }, [params?.slug]);
  const getProductByCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <h1 className="text-center">{category?.name}</h1>
      <p className="text-center">{products?.length} results found</p>
      <div className="row">
        <div className="d-flex flex-wrap">
          {products?.map((p) => {
            return (
              <div className="card m-2 " style={{ width: "18rem" }} key={p._id}>
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
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => {
                      navigate(`/product/${p.slug}`);
                    }}
                  >
                    See Details
                  </button>
                  <button className="btn btn-primary ms-1">Add to Cart</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
