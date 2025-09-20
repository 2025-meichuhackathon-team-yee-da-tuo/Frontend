# 移除按鈕Focus時的橘色背景

## 問題描述
用戶要求按鈕在focus時不要變成橘色背景，只保留橘色的outline邊框。

## 修復內容

### 移除的背景色變化：

#### 1. TradeView.vue
- ✅ **submit-btn**: 移除focus時的`background: #E65100`
- ✅ **item-btn**: 移除focus時的`background: #FFF3E0`
- ✅ **item-btn hover+focus**: 移除`background: #FFE0B2`，改為`background: #f0f0f0`

#### 2. MenuView.vue
- ✅ **menu-btn**: 移除focus時的`background: #2a2a2d`
- ✅ **menu-btn hover+focus**: 保持`background: #2a2a2d`（正常的hover背景色）
- ✅ **active menu-btn focus**: 移除`background: #444`

## 修復後的Focus樣式

### 統一的Focus樣式規格：
```css
&:focus {
  outline: 3px solid #FF9800 !important; /* 橘色邊框 */
  outline-offset: 2px; /* 邊框間距 */
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important; /* 陰影效果 */
  /* 沒有背景色變化 */
}
```

### 保持的Hover效果：
```css
&:hover {
  background: [正常的hover背景色]; /* 保持原有的hover效果 */
}

&:hover:focus {
  background: [正常的hover背景色]; /* hover+focus時保持hover背景色 */
}
```

## 修復結果

### 視覺效果：
- ✅ 按鈕focus時只有橘色outline邊框
- ✅ 沒有橘色背景變化
- ✅ 保持原有的hover效果
- ✅ 與輸入框的focus樣式完全一致

### 一致性：
- ✅ 所有按鈕的focus樣式都只顯示outline邊框
- ✅ 沒有背景色變化
- ✅ 保持統一的視覺效果

## 涉及的文件

### 主要修復：
1. **TradeView.vue**
   - submit-btn: 移除橘色背景
   - item-btn: 移除橘色背景
   - hover+focus: 保持正常hover背景色

2. **MenuView.vue**
   - menu-btn: 移除背景色變化
   - active menu-btn: 移除背景色變化
   - hover+focus: 保持正常hover背景色

## 測試建議
1. 使用Tab鍵在按鈕間導航
2. 檢查focus時是否只有橘色邊框，沒有背景色變化
3. 測試hover效果是否正常
4. 確認hover+focus時的背景色是正常的hover背景色
5. 與輸入框的focus效果對比，確保一致性

## 維護說明
- 按鈕focus樣式現在只使用outline邊框，不改變背景色
- 保持原有的hover效果
- 新增按鈕時，請遵循相同的focus樣式規格
- 避免在focus樣式中添加背景色變化

## 效果確認
現在所有按鈕在focus時都只顯示橘色的outline邊框，沒有背景色變化，提供更簡潔一致的視覺效果。
