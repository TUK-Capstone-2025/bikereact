// src/pages/ChangeId.js
import React, { useState } from 'react';

const ChangeId = () => {
  const [newUserId, setNewUserId] = useState('');
  const [message, setMessage] = useState('');

  const handleChangeId = async (e) => {
    e.preventDefault();

    const tokenType = localStorage.getItem('tokenType');
    const accessToken = localStorage.getItem('accessToken');

    if (!tokenType || !accessToken) {
      setMessage('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch('/api/member/changeId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${tokenType} ${accessToken}`,
        },
        body: JSON.stringify({ newUserId }),
      });

      if (response.ok) {
        setMessage('아이디가 성공적으로 변경되었습니다.');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || '아이디 변경 실패');
      }
    } catch (error) {
      setMessage('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">아이디 변경</h2>
      <form onSubmit={handleChangeId} className="space-y-4">
        <input
          type="text"
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
          placeholder="새로운 아이디 입력"
          className="w-full p-2 border rounded"
          required
        />
        <button type="button" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          아이디 변경
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default ChangeId;
