import React, { useEffect, useState } from 'react';

const GithubRepos = ({ username = "khumnath" }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}/repos?sort=updated`)
      .then(res => {
        if (!res.ok) throw new Error("API Limit or Network Error");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setRepos(data);
        } else {
          setRepos([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch repos", err);
        setError(true);
        setLoading(false);
      });
  }, [username]);

  if (loading) return (
    <div className="flex justify-center p-8 bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-800">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  if (error || repos.length === 0) return (
    <div className="text-center p-8 bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500">
      <i className="fa fa-github text-4xl mb-2"></i>
      <p>Repositories unavailable.</p>
    </div>
  );

  const avatarUrl = repos[0]?.owner?.avatar_url;
  const ownerLink = repos[0]?.owner?.html_url;

  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">

      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4 bg-gray-50 dark:bg-[#252525]">
        <a href={ownerLink} target="_blank" rel="noopener noreferrer" className="shrink-0">
          <img
            src={avatarUrl}
            alt={username}
            className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm"
          />
        </a>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white leading-tight">
            {username}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
            GitHub Repositories
          </span>
        </div>
      </div>

      {/* Repo List */}
      <ul className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
        {repos.map(repo => (
          <li key={repo.id}>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between p-4 hover:bg-blue-50 dark:hover:bg-[#2c2c2c] group transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <i className={`fa ${repo.fork ? 'fa-code-fork' : 'fa-book'} text-gray-400 group-hover:text-primary mt-0.5`}></i>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-gray-700 dark:text-gray-200 truncate group-hover:text-primary transition-colors">
                    {repo.name}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-full max-w-[200px] md:max-w-md">
                    {repo.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0 ml-4">

                {repo.language && (
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {repo.language}
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                <i className="fa fa-clock-o"></i>
                <span suppressHydrationWarning>
                  Updated: {new Date(repo.updated_at).toLocaleDateString()}
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>

      {/* Footer / Stats */}
      <div className="p-3 bg-gray-50 dark:bg-[#252525] border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500">
        <a href={`${ownerLink}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
          View all {repos.length} repositories on GitHub &rarr;
        </a>
      </div>
    </div >
  );
};

export default GithubRepos;
