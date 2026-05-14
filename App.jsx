import React, { useState, useEffect } from 'react';

// 类别配置：适合浅色背景的明快马卡龙色系
const CATEGORY_MAP = {
  '餐饮美食': { icon: '🍔', color: 'text-orange-500', bg: 'bg-orange-100' },
  '交通出行': { icon: '🚗', color: 'text-blue-500', bg: 'bg-blue-100' },
  '购物消费': { icon: '🛍️', color: 'text-pink-500', bg: 'bg-pink-100' },
  '娱乐休闲': { icon: '🎮', color: 'text-purple-500', bg: 'bg-purple-100' },
  '住房水电': { icon: '🏠', color: 'text-teal-500', bg: 'bg-teal-100' },
  '其他': { icon: '✨', color: 'text-gray-500', bg: 'bg-gray-200' }
};

// 定义本地存储的 Key
const STORAGE_KEY = 'ai_billing_expenses_data';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. 初始化数据：应用加载时，优先从本地缓存读取数据
  const [expenses, setExpenses] = useState(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData); // 如果有历史数据，解析并返回
      }
    } catch (error) {
      console.error("读取本地数据失败:", error);
    }
    return []; // 如果没有数据或读取失败，返回空数组
  });

  // 2. 监听数据变化：只要 expenses 发生变化（新增或删除），就自动保存到本地
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error("保存数据到本地失败:", error);
    }
  }, [expenses]);

  // 计算总金额
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // 清空所有数据的函数
  const handleClearAll = () => {
    // 弹窗让用户二次确认，防止误触
    if (window.confirm('确定要彻底清空所有记账数据吗？此操作不可恢复哦。')) {
      setExpenses([]); // 清空状态变量，useEffect 会自动同步清空本地存储
    }
  };

  // AI 智能解析逻辑
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
      setErrorMsg(err.message === '找不到金额' ? '请包含消费金额哦，例如：打车花了 25' : '抱歉，未能识别该账单，请重新输入。');
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
    // 浅色灰蓝渐变背景
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 font-sans selection:bg-blue-500/20 text-slate-800 relative overflow-hidden flex justify-center p-4 sm:p-8">
      {/* 柔和的浅色光晕背景 */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-300/30 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-300/30 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 flex flex-col gap-6">
        
        {/* 头部区域 */}
        <header className="flex items-center justify-between pt-6 pb-2">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent flex items-center gap-2 drop-shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#gradient-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              智能记账
            </h1>
            <p className="text-slate-500 text-sm mt-1.5 font-medium">极简你的财务生活</p>
          </div>
          
          <div className="text-right">
            <div className="text-slate-500 text-xs mb-1 font-semibold tracking-wide uppercase">累计消费</div>
            <div className="text-3xl font-mono font-black text-slate-800 tracking-tight drop-shadow-sm">
              ¥{totalAmount.toFixed(2)}
            </div>
          </div>
        </header>

        {/* 核心输入区域 - 浅色磨砂毛玻璃卡片 */}
        <div className="relative group rounded-3xl p-[1px] bg-white/40 shadow-sm overflow-hidden">
            <div className="relative bg-white/70 backdrop-blur-2xl rounded-3xl p-5 flex flex-col gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
                
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isProcessing}
                    placeholder="像聊天一样记账：昨天去超市买了 85 的零食..."
                    className="w-full bg-transparent text-slate-800 placeholder-slate-400 border-none outline-none resize-none text-base h-24 p-2 focus:ring-0 leading-relaxed font-medium"
                />

                {/* 错误提示 */}
                {errorMsg && (
                   <div className="text-rose-500 text-sm px-2 font-medium animate-pulse">{errorMsg}</div>
                )}

                <div className="flex justify-between items-center mt-2 border-t border-slate-100 pt-3">
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        自然语言极速录入
                    </div>
                    
                    <button
                        onClick={handleAIProcess}
                        disabled={isProcessing}
                        className={`relative overflow-hidden rounded-full px-6 py-2.5 font-bold text-sm text-white transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg active:translate-y-[1px] disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed
                            ${isProcessing ? 'bg-slate-400' : 'bg-gradient-to-r from-blue-500 to-teal-400 shadow-[0_4px_14px_0_rgba(59,130,246,0.39)]'}
                        `}
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                解析中...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                ✨ 记一笔
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>

        {/* 账单列表区域 */}
        <div className="flex flex-col gap-3 mt-4 pb-12">
          
          {/* 标题栏与删除按钮 */}
          <div className="flex justify-between items-center mb-2 px-1">
            <h2 className="text-slate-500 text-sm font-bold tracking-wider">账单明细</h2>
            
            {/* 只有当有账单时，才显示清空按钮 */}
            {expenses.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="text-xs font-semibold text-rose-400 hover:text-rose-500 hover:bg-rose-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                清空数据
              </button>
            )}
          </div>
          
          {expenses.length === 0 ? (
            <div className="text-center py-16 bg-white/40 rounded-3xl border border-dashed border-slate-300 text-slate-500 text-sm font-medium">
              干净得像一张白纸 ✨<br/>快在上面输入记一笔吧！
            </div>
          ) : (
            expenses.map((expense) => {
              const catInfo = CATEGORY_MAP[expense.category] || CATEGORY_MAP['其他'];
              
              return (
                <div 
                  key={expense.id} 
                  className="group flex items-center justify-between p-4 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgb(0,0,0,0.05)] hover:bg-white/90 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    {/* 图标容器 */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${catInfo.bg} ${catInfo.color} shadow-inner`}>
                      {catInfo.icon}
                    </div>
                    
                    {/* 详情 */}
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-bold text-base">{expense.category}</span>
                      <span className="text-slate-500 text-xs mt-0.5 line-clamp-1 font-medium">{expense.description}</span>
                    </div>
                  </div>

                  {/* 金额与日期 */}
                  <div className="flex flex-col items-end">
                    <span className="text-slate-800 font-mono font-black text-lg">
                      - {expense.currency}{expense.amount.toFixed(2)}
                    </span>
                    <span className="text-slate-400 text-xs mt-1 font-mono font-medium">
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