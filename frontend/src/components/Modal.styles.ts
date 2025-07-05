import styled from "styled-components";

export const ModalContainer = styled.div`
  position: fixed;
  top:0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 1000px;
  width: 90%;
  margin: 0 auto;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
`;