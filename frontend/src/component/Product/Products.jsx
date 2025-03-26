  import React, { Fragment, useEffect, useState } from "react";
  import "./Products.scss";
  import { useDispatch, useSelector } from "react-redux";
  import { clearErrors, getProduct } from "../../actions/productAction";
  import Loader from "../layouts/Loader/Loader";
  import ProductCard from "../Home/ProductCard";
  import { useParams } from "react-router-dom";
  import Pagination from "react-js-pagination";
  import Slider from "@mui/material/Slider";
  import { useAlert } from "react-alert";
  import MetaDate from "../layouts/MetaDate";
  import NoDataImg from "../images/nodata.png";
  // import Typography from "@mui/material/core/Typography";

  const categories = [
    "Shirts",
    "Footwear",
    "Bottom",
    "Tops",
    "Camera",
    "SmartPhones",
  ];

  const Products = () => {
    const alert = useAlert();
    const { keyword } = useParams();
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 25000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0);
    const { loading, products, error, resultPerPage, productsCount } =
      useSelector((state) => state.products);

    const setCurrentPageNo = (e) => {
      setCurrentPage(e);
    };

    // for price filter
    const priceHandler = (event, newPrice) => {
      setPrice(newPrice);
    };

    useEffect(() => {
      if (error) {
        alert.error(error);
        dispatch(clearErrors());
      }
      dispatch(getProduct(keyword, currentPage, price, category, ratings));
      
      console.log("Products from API:", products); // Debugging line
    
    }, [dispatch, keyword, currentPage, price, category, ratings, error, alert]);
    

    return (
      <Fragment>
        {loading ? (
          <Loader />
        ) : (
          <div className="ProductsMain">
            <MetaDate title="Products --ShopNest" />
            <h2 className="productsHeading">Products</h2>
            <div className="Products">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <img
                  className="noFound"
                  src={NoDataImg}
                  alt="product not found"
                />
              )}
            </div>
            <div className="filterBox">
              <p>Price</p>
              <Slider
                value={price}
                onChange={priceHandler}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={25000}
              />

              <div className="categoryOptBox">
                <p>Category</p>
                <ul className="categoryBox">
                  {categories.map((cat) => (
                    <li
                      className={`category-link ${
                        cat === category ? "catSelected" : ""
                      } `}
                      key={cat}
                      onClick={() => setCategory(cat)}>
                      {cat}
                    </li>
                  ))}
                </ul>
              </div>
              <fieldset>
                <p>Ratings</p>
                <Slider
                  value={ratings}
                  onChange={(e, newRating) => {
                    setRatings(newRating);
                  }}
                  valueLabelDisplay="auto"
                  aria-labelledby="continuos-slider"
                  min={0}
                  max={5}
                />
              </fieldset>
            </div>
            <div className="paginationBox">
              {products.length > 0 ? (
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={productsCount}
                  onChange={setCurrentPageNo}
                  nextPageText="Next"
                  prevPageTexh="Prev"
                  firstPageText="1st"
                  lastPageText="Last"
                  itemClass="page-item"
                  linkClass="page-link"
                  activeClass="pageItemActive"
                  activeLinkClass="pageLinkActive"
                  pageRangeDisplayed={1}
                />
              ) : (
                <p></p>
              )}
            </div>
          </div>
        )}
      </Fragment>
    );
  };

  export default Products;
