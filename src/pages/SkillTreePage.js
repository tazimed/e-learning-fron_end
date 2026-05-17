import React from 'react';
import { Network } from 'lucide-react';

const SkillTreePage = () => {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Network size={64} />
      </div>
      <h2>Skill Tree</h2>
      <p>Cette section est en cours de développement. Bientôt, vous pourrez visualiser votre progression sous forme d'arbre de compétences.</p>
    </div>
  );
};

export default SkillTreePage;
