import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../component/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [cart, setCart] = useCart();

  // get total count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  // load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // get all product
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // filter by category
  const handelFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  useEffect(() => {
    if (!checked.length || !checked.radio) getAllProducts();
  }, [checked.length, checked.radio]);

  useEffect(() => {
    if (checked.length || checked.radio) filterProduct();
  }, [checked, radio]);

  // filtered product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product//product-filters`,
        { checked, radio }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"Ecommerce App - All products | Best offers"}>
      <div className="row">
        <div className="col-md-3 mt-3">
          <h4 className="text-center">Filters by Category</h4>
          <div className="d-flex flex-column mx-5 mt-3">
            {categories?.map((c) => {
              return (
                <Checkbox
                  key={c._id}
                  onChange={(e) => {
                    handelFilter(e.target.checked, c._id);
                  }}
                >
                  {c?.name}
                </Checkbox>
              );
            })}
          </div>

          {/* Price Filter  */}
          <h4 className="text-center mt-3">Filters by Price</h4>
          <div className="d-flex flex-column mx-5 mt-3">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices.map((p) => {
                return (
                  <div key={p._id}>
                    <Radio value={p.array}>{p.name}</Radio>;
                  </div>
                );
              })}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column mx-5 mt-3">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              Reset Filters
            </button>
          </div>
        </div>
        <div className="col-md-9 mt-3">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => {
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
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => {
                        navigate(`/product/${p.slug}`);
                      }}
                    >
                      See Details
                    </button>
                    <button
                      className="btn btn-primary ms-1"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item added to cart");
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
