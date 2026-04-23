# Chat Feature Test Plan

## 1. Unit Testing (Component Level)

### 1.1 `ChatWidget.jsx` Rendering
*   **Test Case 1.1.1**: Verify component renders without crashing.
*   **Test Case 1.1.2**: Verify floating button is visible (fixed position, z-index).
*   **Test Case 1.1.3**: Verify unread badge appears when `unreadCount > 0` and chat is closed.
*   **Test Case 1.1.4**: Verify unread badge disappears when chat is opened.

### 1.2 State Management
*   **Test Case 1.2.1**: Toggle `isOpen` state when floating button is clicked.
*   **Test Case 1.2.2**: Verify message input state updates on change.
*   **Test Case 1.2.3**: Verify `messages` array updates when sending a new message.

## 2. Integration Testing (Data Flow)

### 2.1 User Interaction
*   **Test Case 2.1.1**: User can type a message and click send button.
*   **Test Case 2.1.2**: Message appears in the chat window immediately (optimistic UI).
*   **Test Case 2.1.3**: Input field clears after sending.

### 2.2 System Response (Simulation/Backend)
*   **Test Case 2.2.1**: System auto-reply is received after 1 second (mock).
*   **Test Case 2.2.2**: Incoming message triggers unread counter increment if chat is closed.
*   **Test Case 2.2.3**: Verify message timestamp formatting.

## 3. User Acceptance Testing (UAT)

### 3.1 Visibility & Layout
*   **Test Case 3.1.1**: Widget appears on all authenticated pages (Dashboard, Profile, etc.).
*   **Test Case 3.1.2**: Widget does NOT obstruct critical UI elements (footer, navigation).
*   **Test Case 3.1.3**: Widget is responsive on mobile (width adjustment).

### 3.2 Browser Compatibility
*   **Test Case 3.2.1**: Chrome (latest) - Verified.
*   **Test Case 3.2.2**: Firefox (latest) - Verified.
*   **Test Case 3.2.3**: Edge (latest) - Verified.
*   **Test Case 3.2.4**: Safari (macOS/iOS) - To be verified.

## 4. Stress & Performance Testing

### 4.1 Message Load
*   **Test Case 4.1.1**: Send 20 messages in rapid succession. Verify no UI freeze.
*   **Test Case 4.1.2**: Verify scroll-to-bottom works correctly with many messages.

## 5. Backend Validation (Current Status)

### 5.1 Connection
*   **Current Status**: Mock Implementation (Client-side only).
*   **Root Cause**: No WebSocket/API endpoint connected yet.
*   **Action Plan**:
    1.  Install Laravel Reverb or Pusher.
    2.  Create `Message` model and migration.
    3.  Create API endpoints for sending/fetching messages.
    4.  Implement `MessageSent` event for broadcasting.

### 5.2 Error Handling
*   **Test Case 5.2.1**: Network disconnect simulation (future implementation).
*   **Test Case 5.2.2**: API failure handling (future implementation).

