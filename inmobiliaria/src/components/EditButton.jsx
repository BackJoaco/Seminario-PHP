import React from 'react';
import { useNavigate } from 'react-router-dom';

const EditButton = ({ linkEdit, id }) => {
  const navigate = useNavigate();

  const navigateToEdit = () => {
    navigate(`${linkEdit}/${id}`);
  };

  return (
    <button onClick={navigateToEdit}>
      Editar
    </button>
  );
};

export default EditButton;
