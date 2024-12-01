import { create } from 'zustand';

// Global değişkenler - sayfa yenilendiğinde bile korunacak
window.GLOBAL_REPOSITORIES = window.GLOBAL_REPOSITORIES || [
  {
    _id: '674a974289808988eb73fd14',
    name: 'instagram-report-bot',
    description: 'Powerful Instagram Report Bot & Mass Reporting Tool. Automate the process of reporting multiple Instagram accounts, posts, and stories that violate community guidelines. Features include bulk reporting, automated account detection, and mass report automation. #InstagramReportBot #MassReport #AutomationTool',
    owner: {
      _id: '1',
      username: 'tDev',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1234567'
    },
    isPrivate: false,
    stars: 6122,
    topics: [
      'instagram-report-bot',
      'instagram-mass-report',
      'instagram-report-automation',
      'instagram-report-tool',
      'instagram-report-script',
      'instagram-mass-report-bot',
      'instagram-mass-reporting',
      'instagram-report-generator',
      'instagram-auto-report',
      'instagram-report-api'
    ],
    readme: `## 📹 Preview\n\n![c959fdb652dba3649319d1293f016b38](https://i.ibb.co/BfKMX9s/c959fdb652dba3649319d1293f016b38.png)\n\n## 🔥 Tool Features\n- Unlimited Reports - No daily/monthly limits\n- Premium Proxies - Auto-rotating, high-speed\n- Pre-configured accounts - Ready for report\n- 10 Report Types\n- Custom Bot - Your branded Telegram bot\n- Reseller Program - High commission rates\n\n↓ Join​ ↓\n\n[𝗣𝗮𝗶𝗱] Access only via Telegram Bot: \n\n- [Telegram Bot](https://t.me/txrepbot)\n- [Website](https://reportbot.org)\n\n\n## 🧰 Support\n\n- [Telegram Live Chat](https://t.me/ReportBotSupport)\n\n## **DISCLAIMER / NOTES**\n\n\`\`\`console\nThis repo is for EDUCATIONAL PURPOSES ONLY. We Are NOT under any responsibility if a problem occurs.\nOnce again, We do not accept responsibility, all responsibility belongs to the user.\n\`\`\``,
    coverImage: 'https://i.ibb.co/BfKMX9s/c959fdb652dba3649319d1293f016b38.png',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];

window.GLOBAL_USERS = window.GLOBAL_USERS || [
  {
    id: '1',
    username: 'tDev',
    email: 'tdev@example.com',
    password: '852456aa',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1234567',
    bio: 'Site Owner & Developer',
    location: 'Anywhere',
    website: 'reportbot.org',
    createdAt: '2024-01-01T00:00:00.000Z',
    isOwner: true
  }
];

const useStore = create((set, get) => ({
  user: null,
  repositories: window.GLOBAL_REPOSITORIES,
  users: window.GLOBAL_USERS,

  setUser: (user) => {
    set({ user });
  },

  createRepository: (repoData) => {
    const state = get();
    if (!state.user?.isOwner) {
      throw new Error('Only the owner can create repositories');
    }

    const newRepo = {
      _id: Date.now().toString(),
      name: repoData.name,
      description: repoData.description || '',
      owner: {
        _id: state.user.id,
        username: state.user.username,
        avatarUrl: state.user.avatarUrl
      },
      isPrivate: repoData.isPrivate || false,
      stars: 0,
      topics: repoData.topics || [],
      readme: repoData.readme || '# ' + repoData.name,
      coverImage: repoData.coverImage || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    window.GLOBAL_REPOSITORIES.push(newRepo);
    set({ repositories: window.GLOBAL_REPOSITORIES });
    return newRepo;
  },

  updateRepository: (owner, repoName, updates) => {
    const state = get();
    if (!state.user?.isOwner) {
      throw new Error('Only the owner can update repositories');
    }

    const repoIndex = window.GLOBAL_REPOSITORIES.findIndex(
      repo => repo.owner.username === owner && repo.name === repoName
    );

    if (repoIndex !== -1) {
      window.GLOBAL_REPOSITORIES[repoIndex] = {
        ...window.GLOBAL_REPOSITORIES[repoIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }

    set({ repositories: window.GLOBAL_REPOSITORIES });
    return window.GLOBAL_REPOSITORIES[repoIndex];
  },

  updateRepositories: (updatedRepositories) => {
    const state = get();
    if (state.user?.isOwner) {
      window.GLOBAL_REPOSITORIES = updatedRepositories;
      set({ repositories: window.GLOBAL_REPOSITORIES });
    }
  },

  fetchRepositories: () => {
    return window.GLOBAL_REPOSITORIES;
  },

  updateAvatar: (username, avatarUrl) => {
    const state = get();
    if (!state.user?.isOwner) {
      throw new Error('Only the owner can update avatars');
    }

    // Kullanıcı avatarını güncelle
    const userIndex = window.GLOBAL_USERS.findIndex(u => u.username === username);
    if (userIndex !== -1) {
      window.GLOBAL_USERS[userIndex] = {
        ...window.GLOBAL_USERS[userIndex],
        avatarUrl
      };
    }

    // Repository'lerdeki avatarları güncelle
    window.GLOBAL_REPOSITORIES = window.GLOBAL_REPOSITORIES.map(repo => {
      if (repo.owner.username === username) {
        return {
          ...repo,
          owner: {
            ...repo.owner,
            avatarUrl
          }
        };
      }
      return repo;
    });

    set({
      users: window.GLOBAL_USERS,
      repositories: window.GLOBAL_REPOSITORIES,
      user: state.user?.username === username 
        ? { ...state.user, avatarUrl } 
        : state.user
    });

    return { success: true };
  },

  login: (credentials) => {
    const user = window.GLOBAL_USERS.find(u => u.username === credentials.username);
    if (user && credentials.password === user.password) {
      const { password, ...userWithoutPassword } = user;
      set({ user: userWithoutPassword });
      return { user: userWithoutPassword };
    }
    throw new Error('Invalid credentials');
  },

  register: () => {
    throw new Error('Registration is disabled');
  },

  logout: () => {
    set({ user: null });
  }
}));

export default useStore; 