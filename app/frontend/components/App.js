import React, { useState, useEffect } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import { axiosWithAuth } from "../axios";
import axios from "axios";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  const navigate = useNavigate();

  const currentArticle = articles.find(
    (article) => article.article_id == currentArticleId
  );

  const redirectToLogin = () => {
    navigate("/");
  };

  const redirectToArticles = () => {
    navigate("/articles");
  };

  const logout = () => {
    if (localStorage.getItem("token")) localStorage.removeItem("token");
    setMessage("Goodbye!");
    redirectToLogin();
  };

  const login = ({ username, password }) => {
    setMessage("");
    setSpinnerOn(!spinnerOn);
    axios
      .post(loginUrl, { username, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setMessage(res.data.message);
        setSpinnerOn(spinnerOn);
        navigate("/articles");
      })
      .catch((err) => console.log(err));
  };

  const getArticles = () => {
    setMessage("");
    setSpinnerOn(!spinnerOn);

    axiosWithAuth()
      .get(articlesUrl)
      .then((res) => {
        setSpinnerOn(spinnerOn);
        setArticles(res.data.articles);
        setMessage(res.data.message);
      })
      .catch((err) => {
        setSpinnerOn(spinnerOn);
        if (err.response.status === 401) redirectToLogin();
      });
  };

  const postArticle = (article) => {
    setMessage("");
    setSpinnerOn(!spinnerOn);

    axiosWithAuth()
      .post(articlesUrl, article)
      .then((res) => {
        setArticles([...articles, res.data.article]);
        setMessage(res.data.message);
        setCurrentArticleId(undefined);
        setSpinnerOn(spinnerOn);
      })
      .catch((err) => {
        setSpinnerOn(spinnerOn);
        console.log(err.error);
      });
  };

  const updateArticle = ({ article_id, article }) => {
    setMessage("");
    setSpinnerOn(!spinnerOn);

    axiosWithAuth()
      .put(`${articlesUrl}/${article_id}`, article)
      .then((res) => {
        const newArticle = res.data.article;

        const updatedArticles = articles.map((article) => {
          return article.article_id === newArticle.article_id
            ? newArticle
            : article;
        });

        setArticles(updatedArticles);
        setMessage(res.data.message);
        setCurrentArticleId(undefined);
        setSpinnerOn(spinnerOn);
      })
      .catch((err) => {
        setSpinnerOn(spinnerOn);
        console.log(err.error);
      });
  };

  const deleteArticle = (article_id) => {
    setMessage("");
    setSpinnerOn(!spinnerOn);

    axiosWithAuth()
      .delete(`${articlesUrl}/${article_id}`)
      .then((res) => {
        console.log(res.data);
        const deletedArticle = res.data.article;

        const purgedArticles = articles.filter(
          (article) => article.article_id !== article_id
        );

        setArticles(purgedArticles);
        setMessage(res.data.message);
        setSpinnerOn(spinnerOn);
      })
      .catch((err) => {
        setSpinnerOn(spinnerOn);
        console.log(err.error);
      });
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticle={currentArticle}
                />
                <Articles
                  articles={articles}
                  getArticles={getArticles}
                  deleteArticle={deleteArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticleId={currentArticleId}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
