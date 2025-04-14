import { useEffect, useState } from "react"
import Nav from "./Nav"
import Article from "./Article"
import ArticleEntry from "./ArticleEntry"
import { fetchArticles, createArticle } from "../Services/articleService"
import "./App.css"
import { useAuthentication } from "../Services/authService"
import { Signin, SignOut } from "./Auth";


export default function App() {
  const [articles, setArticles] = useState([])
  const [article, setArticle] = useState(null)
  const [writing, setWriting] = useState(null)
  const user = useAuthentication()
  // This is a trivial app, so just fetch all the articles once, when
  // the app is loaded. A real app would do pagination. Note that
  // "fetchArticles" is what gets the articles from the service and
  // then "setArticles" writes them into the React state.
  useEffect(() => {
    if (user) {
      fetchArticles().then(setArticles)
    }
  }, [user])

  // Update the "database" then update the internal React state. These
  // two steps are definitely necessary.
  function addArticle({ title, body }) {
    createArticle({ title, body }).then((article) => {
      setArticle(article)
      setArticles([article, ...articles])
      setWriting(false)
    })
  }
  function handleUpdateArticle(updated) {
    // Update the article in state
    setArticles((prevArticles) =>
      prevArticles.map((a) => (a.id === updated.id ? updated : a))
    );
    setArticle(updated); // Update the selected article too
  }

  function handleDeleteArticle(deletedId) {
    setArticles((prevArticles) =>
      prevArticles.filter((a) => a.id !== deletedId)
    );
    setArticle(null); // Clear selected article
  }

  return (
    <div className="App">
      <header>
        BLOG APP
        {user && <button onClick={() => setWriting(true)}>NEW ARTICLE</button>}
        {!user ? <Signin /> : <SignOut />}
      </header>

      {!user ? "" : < Nav articles={articles} setArticle={setArticle} />}
      {!user ? (
        ""
      ) : writing ? (
        <ArticleEntry addArticle={addArticle} />
      ) : (
        <Article article={article}
          onUpdate={handleUpdateArticle}
          onDelete={handleDeleteArticle} />

      )}
    </div>
  )
}