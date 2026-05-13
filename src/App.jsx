import React, { useState } from 'react';

// 类别配置：包含图标、颜色和背景，用于渲染炫酷列表
const CATEGORY_MAP = {
  '餐饮美食': { icon: '🍔', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  '交通出行': { icon: '🚗', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  '购物消费': { icon: '🛍️', color: 'text-pink-400', bg: 'bg-pink-500/20' },
  '娱乐休闲': { icon: '🎮', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  '住房水电': { icon: '🏠', color: 'text-teal-400', bg: 'bg-teal-500/20' },
  '其他': { icon: '✨', color: 'text-gray-400', bg: 'bg-gray-500/20' }
};

export default function App() {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [expenses, setExpenses] = useState([
    { id: '1', amount: 25.5, currency: '¥', category: '餐饮美食', date: new Date().toISOString().split('T')[0], description: '一杯拿铁和牛角包' }
  ]);
  const [errorMsg, setErrorMsg] = useState('');

  // 计算总金额
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAIProcess = async () => {
    if (!inputText.trim()) {
      setErrorMsg('请先输入你的消费内容哦~');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      // 模拟一点点处理时间，让交互体验更自然流畅
      await new Promise(resolve => setTimeout(resolve, 600)); 
      
      // 1. 智能提取金额：匹配字符串中的第一组数字（支持小数）
      const amountMatch = inputText.match(/\d+(\.\d+)?/);
      if (!amountMatch) {
          throw new Error('找不到金额');
      }
      const amount = parseFloat(amountMatch[0]);

      // 2. 智能提取分类：通过生活常见词库进行精准匹配
      const keywordMap = {
          '餐饮美食': ['吃', '喝', '饭', '菜', '水果', '零食', '奶茶', '咖啡', '早餐', '午餐', '晚餐', '外卖', '餐厅', '聚餐', '水', '面', '粉', '肉', '火锅', '烧烤', '肯德基', '麦当劳', '星巴克'],
          '交通出行': ['车', '打车', '公交', '地铁', '高铁', '火车', '机票', '飞机', '加油', '停车', '滴滴', '出租', '单车', '交通', '路费', '过路费', '共享单车'],
          '购物消费': ['买', '衣服', '鞋', '包', '淘宝', '京东', '购物', '超市', '便利店', '日用', '纸', '裙', '裤', '商城', '拼多多', '菜市场'],
          '娱乐休闲': ['玩', '电影', '游戏', '唱歌', 'KTV', '旅游', '门票', '剧本杀', '密室', '网吧', '游乐园', '充值', '视频会员', '漫展'],
          '住房水电': ['房租', '水费', '电费', '网费', '燃气', '维修', '物业', '住宿', '酒店', '房', '宽带']
      };

      let matchedCategory = '其他';
      for (const [category, keywords] of Object.entries(keywordMap)) {
          // 如果用户输入的话语中包含了词库中的任意一个词，就归为该类
          if (keywords.some(keyword => inputText.includes(keyword))) {
              matchedCategory = category;
              break;
          }
      }

      // 3. 智能提取日期：判断是否包含特定时间词
      let date = new Date();
      if (inputText.includes('昨天')) {
          date.setDate(date.getDate() - 1);
      } else if (inputText.includes('前天')) {
          date.setDate(date.getDate() - 2);
      } else if (inputText.includes('大前天')) {
          date.setDate(date.getDate() - 3);
      }
      const dateStr = date.toISOString().split('T')[0];

      // 4. 组装最终记录
      const newExpense = {
        id: Math.random().toString(36).substr(2, 9),
        amount: amount,
        currency: '¥',
        category: matchedCategory,
        date: dateStr,
        description: inputText // 直接将原话作为描述保存
      };
      
      setExpenses([newExpense, ...expenses]);
      setInputText(''); // 清空输入框

    } catch (err) {
      console.error("解析错误:", err);
      // 如果没有输入数字，给出友好的提示
      setErrorMsg(err.message === '找不到金额' ? '请在输入中包含消费金额哦，例如：打车花了 25' : '抱歉，未能识别该账单，请重新输入。');
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setIsProcessing(false);
    }
  };

  // 支持回车键快速记录
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAIProcess();
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 font-sans selection:bg-cyan-500/30 text-white relative overflow-hidden flex justify-center p-4 sm:p-8">
      {/* 炫酷背景光晕 */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/20 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 flex flex-col gap-6">
        
        {/* 头部区域 */}
        <header className="flex items-center justify-between pt-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              AI 智能记账
            </h1>
            <p className="text-slate-400 text-sm mt-1">你的私人财务助手</p>
          </div>
          
          <div className="text-right">
            <div className="text-slate-400 text-xs mb-1">本月总计</div>
            <div className="text-2xl font-mono font-bold text-white tracking-tight">
              ¥{totalAmount.toFixed(2)}
            </div>
          </div>
        </header>

        {/* 核心输入区域 - 毛玻璃卡片 */}
        <div className="relative group rounded-3xl p-[1px] bg-gradient-to-b from-white/10 to-transparent overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-5 flex flex-col gap-4">
                
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isProcessing}
                    placeholder="例如：昨天打车去公司花了 35 元..."
                    className="w-full bg-transparent text-white placeholder-slate-500 border-none outline-none resize-none text-base h-24 p-2 focus:ring-0"
                />

                {/* 错误提示 */}
                {errorMsg && (
                   <div className="text-rose-400 text-sm px-2 animate-pulse">{errorMsg}</div>
                )}

                <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        支持自然语言输入
                    </div>
                    
                    <button
                        onClick={handleAIProcess}
                        disabled={isProcessing}
                        className={`relative overflow-hidden rounded-full px-6 py-2.5 font-medium text-sm text-white transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed
                            ${isProcessing ? 'bg-slate-700' : 'bg-gradient-to-r from-cyan-500 to-purple-600 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(192,132,252,0.5)]'}
                        `}
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                正在分析...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                ✨ AI 记录
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>

        {}
        {/* 账单列表区域 */}
        <div className="flex flex-col gap-3 mt-4 pb-10">
          <h2 className="text-slate-400 text-sm font-medium mb-1 px-1">近期账单</h2>
          
          {expenses.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm border border-dashed border-slate-700 rounded-2xl">
              还没有记录，快来试试 AI 记账吧！
            </div>
          ) : (
            expenses.map((expense) => {
              const catInfo = CATEGORY_MAP[expense.category] || CATEGORY_MAP['其他'];
              
              return (
                <div 
                  key={expense.id} 
                  className="group flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-white/5 hover:bg-slate-800/60 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    {/* 图标容器 */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${catInfo.bg} ${catInfo.color}`}>
                      {catInfo.icon}
                    </div>
                    
                    {/* 详情 */}
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{expense.category}</span>
                      <span className="text-slate-400 text-xs mt-0.5 line-clamp-1">{expense.description}</span>
                    </div>
                  </div>

                  {/* 金额与日期 */}
                  <div className="flex flex-col items-end">
                    <span className="text-white font-mono font-bold text-lg">
                      - {expense.currency}{expense.amount.toFixed(2)}
                    </span>
                    <span className="text-slate-500 text-xs mt-0.5 font-mono">
                      {expense.date}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
      </div>
    </div>
  );
}