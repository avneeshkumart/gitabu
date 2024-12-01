import React, { useState, useEffect } from 'react';

function RepoList() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const fetchRepos = async () => {
      const response = await fetch('/api/repos');
      const data = await response.json();
      setRepos(data);
    };
    fetchRepos();
  }, []);

  const handleStarChange = (repoId, newStarCount) => {
    setRepos(repos.map(repo => {
      if (repo.id === repoId) {
        return {...repo, stargazers_count: newStarCount};
      }
      return repo;
    }));
  };

  return (
    <div className="space-y-4">
      {repos.map(repo => (
        <div key={repo.id} className="border p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{repo.name}</h3>
            <div className="flex items-center space-x-2">
              <span>⭐</span>
              <input 
                type="number"
                min="0"
                value={repo.stargazers_count || 0}
                onChange={(e) => handleStarChange(repo.id, parseInt(e.target.value))}
                className="w-20 px-2 py-1 border rounded"
              />
            </div>
          </div>
          <p className="text-gray-600">{repo.description}</p>
        </div>
      ))}
    </div>
  );
}

export default RepoList; 