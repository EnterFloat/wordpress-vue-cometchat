// routes.js

import AppLoggedOut from './components/AppLoggedOut';
// import AppNavigationComponent from './components/AppNavigationComponent';
import ChatContainer from './lib/cometchat-components/components/ChatContainer';
import GuestChatContainer from './lib/cometchat-components/components/GuestChatContainer';

import ConversationScreen from './lib/cometchat-components/components/ConversationScreen';
import GroupScreen from './lib/cometchat-components/components/GroupScreen';
import ContactScreen from './lib/cometchat-components/components/ContactScreen';


import UserList from './lib/cometchat-components/components/UserList';
import ChatList from './lib/cometchat-components/components/ChatList';
import GroupList from './lib/cometchat-components/components/GroupList'

const routes = [
    { path: '/signed-out', component: AppLoggedOut, name: "AppLoggedOut" },
    // { path: '/menu', component: AppNavigationComponent },
    { path: '/', component: ChatContainer, name: "ChatContainer" },
    { path: '/guest', component: GuestChatContainer, name: "GuestChatContainer" },

    { path: '/conversation-screen', component: ConversationScreen },
    { path: '/group-screen', component: GroupScreen },
    { path: '/contact-screen', component: ContactScreen },




    
    { path: '/contact-list', component: UserList },
    { path: '/chat-list', component: ChatList },
    { path: '/group-list', component: GroupList }

    
];

export default routes;