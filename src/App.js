import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import Imageupload from "./Imageupload";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);

  const [open, setopen] = useState(false);
  const [openSignIn, setopensignin] = useState("false");

  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [user, setuser] = useState(null);


  // useEffect Runs a piece of code based on a specific condition

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        console.log(authUser);
        setuser(authUser);
      } else {
        // user has logged out...
        setuser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    // this is where the code runs
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        // every time a new is added , this code fires...
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signup = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setopen(false);
  };

  const signin = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setopensignin(false);
  };

  return (
    <div className="App">
      <Modal open={open} onClose={() => setopen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup" action="">
            <center>
              <img src="logo1.png" alt="" className="app__headerimage" />
            </center>
            <Input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
            <Button
              type="submit"
              className="btnsignupmodal"
              variant="contained"
              color="secondary"
              onClick={signup}
            >
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setopensignin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup" action="">
            <center>
              <img src="logo1.png" alt="" className="app__headerimage" />
            </center>

            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
            <Button
              type="submit"
              className="btnsignupmodal"
              variant="contained"
              color="secondary"
              onClick={signin}
            >
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img src="logo.png" alt="LOGO" className="app__headerimage" />
        {user ? (
          <Button
            onClick={() => auth.signOut()}
            variant="outlined"
            color="secondary"
            className="btn_modal"
          >
            Logout
          </Button>
        ) : (
          <div className="app__loginContainer">
            <Button
              onClick={() => setopensignin(true)}
              variant="outlined"
              color="secondary"
              className="btn_modal"
            >
              Sign In
            </Button>
            <Button
              onClick={() => setopen(true)}
              variant="outlined"
              color="secondary"
              className="btn_modal"
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="postss">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postid={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />

          ))}
        </div>
        
      </div>

      {user?.displayName ? (
        <Imageupload username={user.displayName} />
      ) : (
        <h3 className="sorry">Sorry You need to Login to Upload</h3>
      )}
    </div>
  );
}

export default App;
