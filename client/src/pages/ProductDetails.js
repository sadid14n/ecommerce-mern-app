import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);

  // initial details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);
  // get product
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getRelatedProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  // get related product
  const getRelatedProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProduct(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <div className="row container mt-2">
        <div className="col-md-6">
          <img
            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product?._id}`}
            className="card-img-top"
            alt={product?.name}
          />
        </div>
        <div className="col-md-6">
          <h3 className="text-center">Product Details</h3>
          <h1>{product.name}</h1>
          <h3>{product.description}</h3>
          <p>Category: {product.category?.name}</p>
          <p>Rs: {product.price}</p>
          <p>Available Quantity: {product.quantity}</p>
          <p>Shipping: {product.shipping ? "Yes" : "No"}</p>
          <button className="btn btn-primary ms-1">Add to Cart</button>
        </div>
      </div>
      <hr />
      <div className="row container">
        <h2>Similer Products</h2>
        {relatedProduct.length < 1 && (
          <p className="text-center">No similar product found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProduct?.map((p) => {
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

export default ProductDetails;
