import React, { useState, useEffect, useMemo } from 'react';
import * as api from '../api';
import NetworkGraph from '../components/NetworkGraph';
import { UserPlus, Link, Award, Map, Users, Heart, Zap, Database, Share2, Hexagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [influencer, setInfluencer] = useState(null);
  const [userName, setUserName] = useState('');
  const [conn1, setConn1] = useState('');
  const [conn2, setConn2] = useState('');
  
  // BFS path state
  const [pathStart, setPathStart] = useState('');
  const [pathEnd, setPathEnd] = useState('');
  const [shortestPath, setShortestPath] = useState(null);

  // Recommendations state
  const [recUser, setRecUser] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  // Communities state
  const [communities, setCommunities] = useState([]);

  const stats = useMemo(() => {
    const totalNodes = users.length;
    const totalConnections = Math.floor(users.reduce((acc, u) => acc + u.connections.length, 0) / 2);
    return { totalNodes, totalConnections, communityCount: communities.length };
  }, [users, communities]);

  const fetchData = async () => {
    try {
      const res = await api.getNetwork();
      setUsers(res.data);
      const infRes = await api.getInfluencer();
      setInfluencer(infRes.data.influencer);
      
      const commRes = await api.getCommunities();
      setCommunities(commRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!userName) return;
    try {
      await api.addUser(userName);
      setUserName('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Error adding user");
    }
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!conn1 || !conn2) return;
    try {
      await api.connectUsers(conn1, conn2);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Error connecting users");
    }
  };

  const findPath = async (e) => {
    e.preventDefault();
    if (!pathStart || !pathEnd) return;
    try {
      const res = await api.getShortestPath(pathStart, pathEnd);
      setShortestPath(res.data.path);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetRecommendations = async (userId) => {
    setRecUser(userId);
    if (!userId) {
       setRecommendations([]);
       return;
    }
    try {
      const res = await api.getRecommendations(userId);
      setRecommendations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen p-6 md:p-10">
      {/* Visual background layers */}
      <div className="cyber-grid" />
      <div className="bg-glow" />
      <div className="scanline" />

      {/* Header & Stats Bar */}
      <header className="max-w-[1600px] mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="bg-neon-teal/20 p-3 rounded-lg border border-neon-teal/40">
              <Share2 className="text-[#00f5c4]" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white uppercase italic">
                Social <span className="text-[#00f5c4]">Network</span> Analyzer
              </h1>
              <p className="text-xs mono tracking-widest text-gray-500 uppercase">Influence Analysis System v2.0</p>
            </div>
          </motion.div>

          <div className="flex gap-4 w-full md:w-auto">
            {[
              { label: 'Total Nodes', val: stats.totalNodes, icon: Database, color: 'text-teal-400' },
              { label: 'Total Links', val: stats.totalConnections, icon: Link, color: 'text-purple-400' },
              { label: 'Communities', val: stats.communityCount, icon: Hexagon, color: 'text-amber-400' }
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex-1 md:w-40 cyber-card p-4 flex flex-col justify-center items-center text-center"
              >
                <stat.icon className={stat.color} size={18} />
                <span className="text-2xl font-bold mono mt-1">{stat.val}</span>
                <span className="text-[10px] uppercase tracking-tighter text-gray-500">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        
        {/* Left Side: Controls */}
        <aside className="space-y-6">
          {/* Add User */}
          <section className="cyber-card p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2 text-teal-400">
              <UserPlus size={16} /> User Entry
            </h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Subject ID/Name..." 
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 mono text-sm focus:border-[#00f5c4] focus:ring-1 focus:ring-[#00f5c4] outline-none transition-all"
              />
              <button className="w-full neon-btn-teal font-bold py-3 rounded-lg text-xs uppercase tracking-widest">
                Initialize User
              </button>
            </form>
          </section>

          {/* Connect Users */}
          <section className="cyber-card p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2 text-purple-400">
              <Link size={16} /> Neural Link
            </h2>
            <form onSubmit={handleConnect} className="space-y-4">
              <select 
                value={conn1} 
                onChange={(e) => setConn1(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 mono text-sm outline-none focus:border-purple-500"
              >
                <option value="">NODE A</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
              <select 
                value={conn2} 
                onChange={(e) => setConn2(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 mono text-sm outline-none focus:border-purple-500"
              >
                <option value="">NODE B</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
              <button className="w-full neon-btn-purple font-bold py-3 rounded-lg text-xs uppercase tracking-widest">
                Force Connection
              </button>
            </form>
          </section>

          {/* Path Finder */}
          <section className="cyber-card p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2 text-amber-500">
              <Map size={16} /> Path Finder
            </h2>
            <form onSubmit={findPath} className="space-y-4">
              <select 
                value={pathStart} 
                onChange={(e) => setPathStart(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 mono text-sm outline-none"
              >
                <option value="">START</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
              <select 
                value={pathEnd} 
                onChange={(e) => setPathEnd(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 mono text-sm outline-none"
              >
                <option value="">END</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
              <button className="w-full neon-btn-amber font-bold py-3 rounded-lg text-xs uppercase tracking-widest">
                Trace Neural Path
              </button>
            </form>
            
            <AnimatePresence>
              {shortestPath && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-amber-500/5 rounded-lg border border-amber-500/20"
                >
                  <p className="text-[10px] text-amber-500 mb-3 mono uppercase font-bold tracking-widest">Path Result:</p>
                  <div className="flex flex-col gap-3">
                    {shortestPath.map((id, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded mono text-[10px] border border-amber-500/30">
                          {users.find(u => u._id === id)?.name}
                        </div>
                        {idx < shortestPath.length - 1 && <div className="h-4 w-[1px] bg-amber-500/30 mx-auto" />}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </aside>

        {/* Right Side: Graph & Bottom Row */}
        <div className="space-y-8 flex flex-col h-full">
          {/* Main Visualization */}
          <section className="cyber-card p-6 flex-grow flex flex-col relative min-h-[600px]">
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-xl font-bold flex items-center gap-3 italic uppercase tracking-wider">
                <Zap className="text-[#00f5c4]" size={20} /> Neural Network Mesh
              </h2>
              {influencer && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-amber-500/20 text-amber-500 px-4 py-2 rounded-full border border-amber-500/50 backdrop-blur-xl flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                >
                  <Award size={14} /> Influencer Detected: {influencer.name}
                </motion.div>
              )}
            </div>
            
            <div className="flex-grow rounded-xl overflow-hidden bg-black/30 border border-white/5">
              <NetworkGraph 
                users={users} 
                influencerId={influencer?._id} 
                path={shortestPath || []}
              />
            </div>
          </section>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recommendations */}
            <section className="cyber-card p-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-pink-500">
                <Heart size={16} /> Link Predictions
              </h2>
              <div className="mb-6">
                <select 
                  value={recUser} 
                  onChange={(e) => handleGetRecommendations(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 mono text-sm outline-none"
                >
                  <option value="">SELECT TARGET NODE</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                </select>
              </div>
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {recommendations.map(rec => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={rec.userId} 
                    className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 hover:border-pink-500/30 transition-all"
                  >
                    <span className="mono text-sm">{rec.name}</span>
                    <span className="text-[10px] mono bg-pink-500/10 text-pink-400 px-3 py-1 rounded-full border border-pink-500/20">
                      {rec.mutualCount} MUTUAL_SIGNALS
                    </span>
                  </motion.div>
                ))}
                {recUser && recommendations.length === 0 && (
                  <p className="text-center text-gray-600 py-8 text-xs uppercase tracking-widest">No matching signals found</p>
                )}
              </div>
            </section>

            {/* Communities */}
            <section className="cyber-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-blue-400">
                  <Users size={16} /> Sub-Clusters
                </h2>
                <button 
                  onClick={fetchData}
                  className="text-[10px] mono bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-4 py-2 border border-blue-500/30 rounded-full transition-all uppercase tracking-widest"
                >
                  RE-SCAN
                </button>
              </div>
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                 {communities.map((comm, idx) => (
                   <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={idx} 
                    className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all"
                   >
                      <p className="text-[9px] text-blue-400 mono mb-3 uppercase tracking-[0.3em] font-bold opacity-70">Sector_{idx + 1}</p>
                      <div className="flex flex-wrap gap-2">
                        {comm.map(u => (
                          <span key={u.id} className="text-[10px] mono bg-black/40 px-3 py-1 rounded border border-blue-500/20">{u.name}</span>
                        ))}
                      </div>
                   </motion.div>
                 ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      
      {/* Footer deco */}
      <footer className="mt-12 text-center text-gray-700 mono text-[10px] uppercase tracking-[1em] py-10 opacity-30">
        End of Data Stream // CyberAnalyzer 2.0
      </footer>
    </div>
  );
};

export default Dashboard;
