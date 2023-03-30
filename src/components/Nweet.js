import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { deleteDoc, updateDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    console.log(ok);
    if (ok) {
      const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
      await deleteDoc(NweetTextRef);
      const imgRef = ref(storageService, nweetObj.attachmentURL);
      await deleteObject(imgRef);
    }
  };
  const toggleEditing = () => {
    setEditing((prev) => !prev);
    setNewNweet(nweetObj.text);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
    await updateDoc(NweetTextRef, {
      text: newNweet,
    });
    setEditing((prev) => !prev);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };
  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              onChange={onChange}
              type="text"
              placeholder="Edit your Nweet"
              value={newNweet}
              required
              autoFocus
              className="formInput"
            />
            <input type="submit" value="Update Nweet" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentURL && <img src={nweetObj.attachmentURL} />}
          {isOwner ? (
            <div class="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default Nweet;
