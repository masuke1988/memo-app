'use client'; //クライアントコンポーネントの指定が必要

import { useEffect, useState } from 'react';

export default function Home() {

  // メモ用のステート
  const [notes, setNotes] = useState([])

  // 新しいメモを入力するためのステート
  const [newNote, setNewNote] = useState('');

  // 編集中のメモのインデックスを保持するステート
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    if (storedNotes) {
      setNotes(storedNotes); // ローカルストレージからメモを取得
    }
  }, []);

  // notes配列が更新されるたびにローカルストレージに保存する
  useEffect(() => { 
    if (notes.length > 0) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes])


  const handleAddNote = () => {
    if (newNote.trim() === '') return //空のメモを追加しないようにする

    // 編集中のメモがある場合。
    if (editIndex !== null) {
      const updatedNotes = [...notes]
      console.log(updatedNotes)
      updatedNotes[editIndex] = { content: newNote }
      setNotes(updatedNotes)
      console.log("リセット前" + editIndex)
      setEditIndex(null)
      
    } else {
      setNotes([...notes, { content: newNote }]) //新しいメモを配列に追加
    }
    setNewNote('') //新しいメモを追加したら、入力欄を空にする
  }

  // 
  const handleEditNote = (index: number) => {
    setNewNote(notes[index].content)
    setEditIndex(index)
  }

  const handleDeleteNote = (index: number) => {
    // index番目のメモを削除
    // _: 現在処理している要素そのもの（使っていないので、アンダースコアで無視）。
    // i: 現在処理している要素のインデックス
    const updatedNotes = notes.filter((_, i) => i !== index)
    setNotes(updatedNotes)
  }

  

  return (
    <div className='p-20 flex flex-col align-center gap-10'>
      <h1 className="text-center">メモアプリ</h1>
      <input
        className='text-zinc-900'
        type="text"
        value={newNote}
        onChange={(e) => {
          setNewNote(e.target.value)
        }}
        placeholder="メモを入力"
      />
      <button onClick={handleAddNote}>
        {editIndex !== null ? 'メモを更新' : 'メモを追加'}
      </button>
      <ul>
        {notes.map((note, index) => (
          <li key={index} className="flex items-center gap-5">
            <span>{note.content}</span>
            <div className="min-w-max">
              <button className="ml-auto mr-3" onClick={() => handleEditNote(index)}>編集</button>
              <button onClick={() => handleDeleteNote(index)}>削除</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
