import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import { Button } from "@material-ui/core";
import firebase from "firebase";

function Post({ postid, imageUrl, username, caption,user }) {
  const [comments, setcomments] = useState([]);
  const [comment, setcomment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postid) {
      unsubscribe = db
        .collection("posts")
        .doc(postid)
        .collection("comments")
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setcomments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postid]);

  const postcomment = (event) => {
      event.preventDefault();
      db.collection("posts").doc(postid).collection("comments").add({
          text: comment,
          username: user.displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      setcomment([]);
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" alt="Sujay" src={imageUrl} />
        <h5>{username}</h5>
      </div>

      {/* header -> avatar + username */}

      <img className="post__image" src={imageUrl} alt="" />

      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>

      
        <div className="post__comments">
          { comments.map((comment) => (
            <p> <strong> {comment.username}</strong> {comment.text} </p>
          ))}
        </div>
    
      {user && (
      <form action="" className="post__commentbox">
        <input
            disabled
          type="text"
          className="post__input"
          placeholder="Add a Comment"
          value={comment}
          onChange={(e) => setcomments(e.target.value)}
        />
        <Button
          disabled={!comment}
          className="post__button"
          type="submit"
          onClick={postcomment}
        >
          Post
        </Button>
      </form>
      )}
    </div>
  );
}

export default Post;
