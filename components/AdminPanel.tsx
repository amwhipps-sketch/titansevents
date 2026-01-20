
import React, { useState, useMemo } from 'react';
import { Fixture, AdminStorage } from '../types';
import { 
  Plus, Edit3, Save, X, Info, Shield, Clock, Trophy, Sparkles, 
  Lock, Eye, Terminal, MapPin, Swords, HelpCircle, ExternalLink, Calendar
} from 'lucide-react';
import { saveAdminData, mapEventToFixture } from '../services/fixtureService';
import { Badge } from './Badge';
import { CALENDAR_ID } from '../constants';

interface AdminPanelProps {
  adminData: AdminStorage;
  fixtures: Fixture[];
  onDataChange: (data: AdminStorage) => void;
  onRefresh: () => void;
}

const Tooltip: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="group relative inline-block">
    <HelpCircle size={14} className="text-theme-muted hover:text-theme-gold cursor-help transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black/95 border border-theme-light rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[200]">
      <h5 className="text-[10px] font-black text-theme-gold uppercase mb-1">{title}</h5>
      <p className="text-[10px] text-theme-muted leading-relaxed font-bold">{content}</p>
    </div>
  </div>
);

const AdminPanel: React.FC<AdminPanelProps> = ({ adminData, fixtures, onDataChange, onRefresh }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'events' | 'guide' | 'preview'>('events');
  const [editingFixture, setEditingFixture] = useState<Partial<Fixture> | null>(null);
  
  // Preview State
  const [previewSummary, setPreviewSummary] = useState('Titans Two Brewers vs AFC Rainbows');
  const [previewDesc, setPreviewDesc] = useState('London Unity League Final. Score: 3-2');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'titansfixtureadmin_01') setIsAuthenticated(true);
    else alert('Incorrect Password');
  };

  const parsedPreview = useMemo(() => {
    const dummyEvent = { UID: 'preview', SUMMARY: previewSummary, DESCRIPTION: previewDesc };
    return mapEventToFixture(dummyEvent, new Date());
  }, [previewSummary, previewDesc]);

  const getPreviewStyles = (p: Fixture) => {
    const isDerby = p.opponent.toLowerCase().includes('titan');
    const isTraining = p.competition === 'Training';
    const isSocial = p.competition === 'Social';
    const isTournament = p.competition === 'Tournament';
    
    // Updated theme logic to match user request: Cup=Gold, Plate=Silver, Shield=Bronze
    const theme = (p.competition + ' ' + (p.competitionTag || '')).toUpperCase().includes('CUP') ? 'gold' :
                  (p.competition + ' ' + (p.competitionTag || '')).toUpperCase().includes('PLATE') ? 'silver' :
                  (p.competition + ' ' + (p.competitionTag || '')).toUpperCase().includes('SHIELD') ? 'bronze' : null;

    let barBg = p.isHome ? 'bg-theme-gold' : 'bg-white';
    let borderColor = p.isHome ? 'border-theme-gold' : 'border-[#f5abb9]';
    let modalHeader = p.isHome ? 'bg-gradient-to-r from-theme-gold to-theme-base' : 'bg-gradient-to-r from-[#f5abb9] to-[#5bcffa]';
    let label = p.isHome ? 'Home Match' : 'Away Match';

    if (isDerby) {
      barBg = 'bg-gradient-to-b from-blue-500 to-orange-500';
      borderColor = 'border-blue-500';
      modalHeader = 'bg-gradient-to-r from-blue-600 via-orange-500 to-orange-600';
      label = 'Titans Derby';
    } else if (isTraining) {
      barBg = 'bg-blue-900';
      borderColor = 'border-blue-900';
      modalHeader = 'bg-blue-900';
      label = 'Training';
    } else if (isSocial) {
      barBg = 'bg-fuchsia-500';
      borderColor = 'border-fuchsia-400';
      modalHeader = 'bg-gradient-to-r from-indigo-900 via-fuchsia-700 to-indigo-900';
      label = 'Social Event';
    } else if (isTournament) {
      barBg = 'bg-purple-600';
      borderColor = 'border-purple-500';
      modalHeader = 'bg-gradient-to-r from-indigo-600 to-purple-600';
      label = 'Tournament';
    }

    if (theme === 'gold') {
      modalHeader = 'bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 text-yellow-900';
      borderColor = 'border-yellow-500';
    } else if (theme === 'silver') {
      modalHeader = 'bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-900';
      borderColor = 'border-slate-300';
    } else if (theme === 'bronze') {
      modalHeader = 'bg-gradient-to-r from-[#cd7f32] via-[#E09F70] to-[#8c5626] text-white';
      borderColor = 'border-[#cd7f32]';
    }

    return { barBg, borderColor, modalHeader, label, isSocial, isTraining };
  };

  const previewStyles = getPreviewStyles(parsedPreview);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
        <div className="bg-theme-dark border border-theme-gold/30 p-8 rounded-2xl shadow-2xl max-w-sm w-full">
            <div className="bg-theme-gold/10 p-4 rounded-full w-fit mx-auto mb-6 text-theme-gold"><Lock size={32} /></div>
            <h2 className="text-xl font-black text-white uppercase text-center mb-2 tracking-tighter italic">Admin Portal</h2>
            <p className="text-theme-muted text-[10px] text-center mb-8 uppercase font-bold tracking-[0.2em]">Authorized Access Only</p>
            <form onSubmit={handleAuth} className="space-y-4">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
                    className="w-full bg-theme-base border border-theme-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-theme-gold transition-colors text-center font-bold"
                />
                <button type="submit" className="w-full bg-theme-gold text-theme-base font-black uppercase py-3 rounded-xl tracking-widest hover:scale-[1.02] active:scale-95 transition-all">Sign In</button>
            </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-theme-base min-h-screen pb-20 animate-fadeIn">
      <div className="flex border-b border-theme-light mb-6 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('events')} className={`px-6 py-4 font-black uppercase tracking-widest text-xs border-b-2 transition-all whitespace-nowrap ${activeTab === 'events' ? 'border-theme-gold text-theme-gold bg-theme-gold/5' : 'border-transparent text-theme-muted hover:text-white'}`}>Manage Sync</button>
        <button onClick={() => setActiveTab('preview')} className={`px-6 py-4 font-black uppercase tracking-widest text-xs border-b-2 transition-all whitespace-nowrap ${activeTab === 'preview' ? 'border-theme-gold text-theme-gold bg-theme-gold/5' : 'border-transparent text-theme-muted hover:text-white'}`}>Live Previewer</button>
        <button onClick={() => setActiveTab('guide')} className={`px-6 py-4 font-black uppercase tracking-widest text-xs border-b-2 transition-all whitespace-nowrap ${activeTab === 'guide' ? 'border-theme-gold text-theme-gold bg-theme-gold/5' : 'border-transparent text-theme-muted hover:text-white'}`}>Parsing Guide</button>
      </div>

      <div className="px-4 max-w-4xl mx-auto">
        {activeTab === 'events' && (
          <div className="space-y-8">
            {/* Calendar Link Section */}
            <section className="bg-theme-gold/5 border border-theme-gold/20 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="text-theme-gold" size={24} />
                <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">Source Calendar</h3>
              </div>
              <p className="text-theme-muted text-xs font-bold leading-relaxed mb-6">
                All fixtures are automatically pulled from the club's official Google Calendar. Add or edit events there to see them reflected here.
              </p>
              <a 
                href={`https://calendar.google.com/calendar/u/0/r?cid=${CALENDAR_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-theme-gold text-theme-base px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
              >
                Open Google Calendar <ExternalLink size={14} />
              </a>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Sync Overrides</h3>
              <div className="grid gap-4">
                {fixtures.filter(f => f.isManual || adminData.manualOverrides[f.id]).length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-theme-light rounded-xl opacity-40">
                    <p className="text-[10px] font-black uppercase tracking-widest text-theme-muted">No active overrides</p>
                  </div>
                ) : (
                  fixtures.filter(f => f.isManual || adminData.manualOverrides[f.id]).map(f => (
                    <div key={f.id} className="bg-theme-dark border border-theme-light p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                           <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${f.isManual ? 'bg-blue-600 text-white' : 'bg-theme-gold text-theme-base'}`}>{f.isManual ? 'Manual' : 'Override'}</span>
                           <span className="text-white font-bold text-sm uppercase">{f.teamName} vs {f.opponent || 'TBC'}</span>
                        </div>
                      </div>
                      <button onClick={() => setEditingFixture(f)} className="p-2 bg-theme-light text-theme-muted hover:text-theme-gold rounded-lg"><Edit3 size={16}/></button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-8 animate-fadeIn">
             <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-theme-dark border border-theme-gold/20 p-6 rounded-2xl flex flex-col gap-4">
                    <h4 className="text-sm font-black text-theme-gold uppercase flex items-center gap-2">
                      <Terminal size={16}/> Parser Input
                    </h4>
                    <div className="space-y-4">
                      <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] font-black text-theme-muted uppercase block">Event Summary (Title)</label>
                            <Tooltip title="Match Detection" content="Titans vs Team = Home. Team vs Titans = Away. Titans vs Titans = Derby. Social/Training = Detected by keywords." />
                          </div>
                          <input value={previewSummary} onChange={e => setPreviewSummary(e.target.value)} className="w-full bg-theme-base border border-theme-light rounded-lg px-4 py-2 text-sm text-white focus:border-theme-gold outline-none"/>
                      </div>
                      <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] font-black text-theme-muted uppercase block">Event Description</label>
                            <Tooltip title="Score & Competition" content="Keywords: LUL, LDL, GFSN, QF, SF, Final. Scores: '3-1' marks as completed and calculates W/L/D." />
                          </div>
                          <textarea value={previewDesc} onChange={e => setPreviewDesc(e.target.value)} className="w-full bg-theme-base border border-theme-light rounded-lg px-4 py-2 text-sm text-white focus:border-theme-gold outline-none h-24"/>
                      </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h4 className="text-sm font-black text-theme-gold uppercase flex items-center gap-2"><Sparkles size={16}/> Component Previews</h4>
                    
                    {/* List Row Style */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-theme-muted uppercase tracking-widest">Agenda View Row</span>
                          <Tooltip title="Color Logic" content="Home: Yellow. Away: Pink/Blue (Trans). Derby: Blue/Orange. Training: Dark Blue. Social: Disco Sparkle." />
                        </div>
                        <div className={`bg-theme-dark border border-theme-light p-4 rounded-xl relative overflow-hidden flex items-center gap-4 ${previewStyles.isSocial ? 'shadow-[0_0_15px_rgba(217,70,239,0.3)] border-fuchsia-500/30' : ''}`}>
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${previewStyles.barBg}`}></div>
                            <div className="text-center min-w-[40px] border-r border-white/10 pr-4">
                                <span className="text-[9px] text-theme-muted block font-black">SAT</span>
                                <span className="text-lg font-black text-white">12</span>
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="text-[9px] font-black text-theme-muted uppercase">{parsedPreview.competition}</div>
                                  {parsedPreview.competitionTag && <span className="text-[7px] bg-theme-gold/10 text-theme-gold border border-theme-gold/30 px-1 rounded">{parsedPreview.competitionTag}</span>}
                                </div>
                                <div className={`text-sm font-black uppercase ${parsedPreview.isHome ? 'text-theme-gold' : 'text-white'}`}>{parsedPreview.teamName}</div>
                                {parsedPreview.opponent && <div className={`text-sm font-black uppercase ${!parsedPreview.isHome ? 'text-theme-gold' : 'text-white'}`}>{parsedPreview.opponent}</div>}
                            </div>
                            <div className="text-right text-xs font-bold text-white">14:00</div>
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-theme-muted uppercase tracking-widest">Detail Modal</span>
                          <Tooltip title="Modal Type" content="Match events show VS layout. Socials/Training use Club Event simplified layout." />
                        </div>
                        <div className={`rounded-2xl border-2 overflow-hidden bg-theme-base ${previewStyles.borderColor} ${previewStyles.isSocial ? 'shadow-[0_0_25px_rgba(217,70,239,0.4)]' : ''}`}>
                            <div className={`px-4 py-2 flex justify-between items-center text-[10px] font-black uppercase tracking-widest ${previewStyles.modalHeader}`}>
                                <span>{previewStyles.label}</span>
                                <span>{parsedPreview.competition}</span>
                            </div>
                            <div className="p-6 flex flex-col items-center gap-4 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-5 grayscale pointer-events-none"><Badge /></div>
                                {previewStyles.isSocial && <Sparkles className="absolute top-2 right-2 text-fuchsia-400 opacity-50 animate-pulse" size={40}/>}
                                <div className="text-white font-black text-2xl uppercase text-center">{parsedPreview.teamName} {parsedPreview.opponent && <><br/><span className="text-theme-muted text-sm block my-1">VS</span> {parsedPreview.opponent}</>}</div>
                                {parsedPreview.score && <div className="bg-theme-gold text-theme-base px-6 py-1 rounded-sm font-black text-lg italic">{parsedPreview.score}</div>}
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="space-y-6 animate-fadeIn">
            <section className="bg-theme-dark border border-theme-light p-6 rounded-2xl">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-2"><Terminal className="text-theme-gold" size={20}/> Titans Parsing Rules</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-theme-gold uppercase">Match Structure</h4>
                    <p className="text-[10px] text-theme-muted leading-relaxed">
                      Matches are identified by <code className="text-white">vs</code> or <code className="text-white">-</code>.<br/>
                      Any detected Titans team determines the side. If both are Titans, it's a <span className="text-theme-gold">Derby</span>.
                    </p>
                    <h4 className="text-xs font-black text-theme-gold uppercase">Competition Tiers</h4>
                    <ul className="text-[10px] text-theme-muted space-y-1">
                      <li>• <span className="text-yellow-500 font-bold">Cup</span>: Metallic Gold Theme</li>
                      <li>• <span className="text-slate-400 font-bold">Plate</span>: Metallic Silver Theme</li>
                      <li>• <span className="text-[#cd7f32] font-bold">Shield</span>: Metallic Bronze Theme</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-theme-gold uppercase">Types & Themes</h4>
                    <ul className="text-[10px] text-theme-muted space-y-2">
                      <li>• <span className="text-blue-500 font-bold">Training</span>: Dark Blue borders, simplified modal.</li>
                      <li>• <span className="text-fuchsia-400 font-bold">Socials</span>: Disco sparkle theme, sparkly icon overlays.</li>
                      <li>• <span className="text-[#f5abb9] font-bold">Away Matches</span>: Trans-inclusive Pink/Blue outline.</li>
                    </ul>
                  </div>
                </div>
            </section>
          </div>
        )}
      </div>

      {editingFixture && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
           <div className="bg-theme-base w-full max-w-lg rounded-2xl border border-theme-gold/30 shadow-2xl p-6 space-y-4">
              <h4 className="text-xl font-black text-white uppercase italic">Manual Entry / Override</h4>
              <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                      <label className="text-[10px] font-black text-theme-muted uppercase block">Team Name</label>
                      <input 
                        value={editingFixture.teamName} 
                        onChange={e => setEditingFixture({...editingFixture, teamName: e.target.value})} 
                        placeholder="Titans Team Name" 
                        className="w-full bg-theme-dark border border-theme-light rounded-lg px-3 py-2 text-sm text-white focus:border-theme-gold outline-none"
                      />
                  </div>
                  <input value={editingFixture.opponent} onChange={e => setEditingFixture({...editingFixture, opponent: e.target.value})} placeholder="Opponent" className="bg-theme-dark border border-theme-light rounded-lg px-3 py-2 text-sm text-white"/>
                  <input value={editingFixture.score || ''} onChange={e => setEditingFixture({...editingFixture, score: e.target.value})} placeholder="Score (e.g. 2-1)" className="bg-theme-dark border border-theme-light rounded-lg px-3 py-2 text-sm text-white"/>
              </div>
              <div className="flex gap-3">
                  <button onClick={() => setEditingFixture(null)} className="flex-1 px-4 py-2 bg-theme-light text-white rounded-xl font-black uppercase text-xs">Cancel</button>
                  <button onClick={() => {
                    const newData = { ...adminData };
                    if (editingFixture.isManual) {
                        const idx = newData.manualAdditions.findIndex(f => f.id === editingFixture.id);
                        if (idx > -1) newData.manualAdditions[idx] = editingFixture as Fixture;
                        else newData.manualAdditions.push(editingFixture as Fixture);
                    } else if (editingFixture.id) newData.manualOverrides[editingFixture.id] = editingFixture;
                    onDataChange(newData); saveAdminData(newData); setEditingFixture(null); onRefresh();
                  }} className="flex-1 px-4 py-2 bg-theme-gold text-theme-base rounded-xl font-black uppercase text-xs">Save</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
