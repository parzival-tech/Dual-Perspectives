import React from 'react';
import { useGameStore } from '../store/gameStore';
import type { Role } from '../types/gameTypes';

const RoleSelection: React.FC = () => {
  const selectRole = useGameStore((state) => state.selectRole);

  const handleRoleSelect = (role: Role) => {
    selectRole(role);
  };

  return (
    <div style={{ margin: '20px 0', padding: '15px', border: '1px dashed #ccc', borderRadius: '5px' }}>
      <h4>How do you want to approach this situation?</h4>
      <button onClick={() => handleRoleSelect('ProductManager')}>
        As Product Manager
      </button>
      <button onClick={() => handleRoleSelect('ProjectManager')} style={{marginLeft: '10px'}}>
        As Project Manager
      </button>
    </div>
  );
};

export default RoleSelection; 