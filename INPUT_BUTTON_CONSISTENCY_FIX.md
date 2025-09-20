# 輸入框與按鈕Focus樣式一致性修復

## 問題描述
用戶反映輸入框和按鈕的focus樣式看起來不太一樣，需要統一它們的外觀。

## 發現的問題

### 1. 雙重邊框問題
- **輸入框**：有`border-color: #FF9800` + `outline: 3px solid #FF9800`
- **按鈕**：有`border-color: #FF9800` + `outline: 3px solid #FF9800`
- 這造成了雙重邊框效果，讓focus樣式看起來不一致

### 2. 基礎邊框樣式不一致
- **輸入框**：`border: 2px solid transparent`
- **按鈕**：`border: none`
- 這導致focus時的外觀差異

## 修復措施

### 1. 移除額外的border-color設定
**TradeView.vue**
- ✅ 移除輸入框focus時的`border-color: #FF9800`
- ✅ 移除按鈕focus時的`border-color: #FF9800`

### 2. 統一基礎邊框樣式
**所有按鈕都改為**：`border: 2px solid transparent`

#### 修復的文件：
- ✅ **TradeView.vue** - submit-btn
- ✅ **MenuView.vue** - menu-btn, menu-close-btn
- ✅ **LoginView.vue** - login-btn
- ✅ **RegisterView.vue** - auth-btn

### 3. 統一transition屬性
- ✅ 所有按鈕的transition都改為`transition: all 0.2s ease`

## 修復後的統一樣式

### 基礎樣式
```css
/* 輸入框和按鈕都使用相同的基礎樣式 */
border: 2px solid transparent;
transition: all 0.2s ease;
```

### Focus樣式
```css
/* 所有元素都使用相同的focus樣式 */
&:focus {
  outline: 3px solid #FF9800 !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(255, 152, 0, 0.3) !important;
}
```

## 修復結果

### 視覺一致性
- ✅ 輸入框和按鈕的focus樣式現在完全一致
- ✅ 沒有雙重邊框效果
- ✅ 統一的邊框寬度和間距
- ✅ 統一的陰影效果

### 技術一致性
- ✅ 所有元素都使用相同的基礎邊框樣式
- ✅ 所有元素都使用相同的transition屬性
- ✅ 所有元素都使用相同的focus樣式規格

## 涉及的文件

### 主要修復
1. **TradeView.vue**
   - 移除輸入框focus時的border-color
   - 移除按鈕focus時的border-color
   - 統一submit-btn的邊框樣式

2. **MenuView.vue**
   - 統一menu-btn的邊框樣式
   - 統一menu-close-btn的邊框樣式

3. **LoginView.vue**
   - 統一login-btn的邊框樣式
   - 統一transition屬性

4. **RegisterView.vue**
   - 統一auth-btn的邊框樣式
   - 統一transition屬性

## 測試建議
1. 使用Tab鍵在輸入框和按鈕間導航
2. 檢查focus樣式是否完全一致
3. 確認沒有雙重邊框效果
4. 測試在不同頁面間的一致性
5. 驗證響應式設計中的效果

## 維護說明
- 所有輸入框和按鈕現在都使用統一的基礎樣式
- 新增元素時，請遵循統一的邊框和focus樣式規格
- 避免在focus樣式中添加額外的border-color設定
- 建議使用CSS變量來管理統一樣式

## 效果確認
現在輸入框和按鈕的focus樣式完全一致，提供統一的用戶體驗，沒有視覺差異。
