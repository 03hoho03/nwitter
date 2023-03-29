import React, { useState } from 'react'
import { dbService } from 'fbase'
import { deleteDoc, updateDoc, doc } from 'firebase/firestore'

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);


  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    console.log(ok);
    if (ok) {
      const NweetTextRef = doc(dbService, 'nweets', `${nweetObj.id}`);
      await deleteDoc(NweetTextRef);
    }
  }
  const toggleEditing = () => {
    setEditing((prev) => !prev);
    setNewNweet(nweetObj.text);
  }
  const onSubmit = async (event) => {
    event.preventDefault();
    const NweetTextRef = doc(dbService, 'nweets', `${nweetObj.id}`);
    await updateDoc(NweetTextRef, {
      text: newNweet,
    });
    setEditing((prev) => !prev);
  }
  const onChange = (event) => {
    const { target: { value } } = event;
    setNewNweet(value);
  }
  return (
    <>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input onChange={onChange} type='text' placeholder='Edit your Nweet' value={newNweet} required />
            <input type='submit' value="Update Nweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      )
        : (
          <>
            <h4>{nweetObj.text}</h4>
            {isOwner ? <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </> : null}
          </>
        )}


    </>
  )
}

export default Nweet;