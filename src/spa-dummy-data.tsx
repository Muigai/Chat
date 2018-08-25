import { React } from "rahisi";
import { R } from "rahisi";
import { A1, F0 } from "rahisi-type-utils";

import { doScroll, TextBox } from "rahisi";
import {
    Template,
    VersionedList,
} from "rahisi";

import {
    A0,
    ENTER_KEY,
    notNullOrWhiteSpace,
} from "rahisi-type-utils";

import {
    delay,
    runTask,
} from "./async-helpers";

interface User {
    readonly name: string;
}

interface ChatStarted {
    readonly kind: "started";
    readonly with: User;
}

interface MessageTo {
    readonly kind: "to";
    readonly to: User;
    readonly content: string;
}

interface MessageFrom {
    readonly kind: "from";
    readonly from: User;
    readonly content: string;
}

type Message = ChatStarted | MessageTo | MessageFrom;

const selectedClass = "spa-x-select";

const placeholderTemplate = (
    <div className="spa-chat-list-note">
        "To chat alone is the fate of all great souls..."
        <br />
        <br />
        "No one is online"
    </div>);

const userTemplate = (props: { user: User, chatee: F0<User>, startChat: A1<User> }) =>
    <div className={() => "spa-chat-list-name " + (props.chatee() === props.user ? selectedClass : "")}
        onClick={() => props.startChat(props.user)}>
        {props.user.name}
    </div>;

const messageTemplate =
    (props: { m: Message, currentUser: F0<User> }) => {

        const [style, content] =
            (() => {
                switch (props.m.kind) {
                    case "from":
                        return ["spa-chat-msg-log-msg", `${props.m.from.name}: ${props.m.content}`];
                    case "to":
                        return ["spa-chat-msg-log-me", `${props.currentUser().name}: ${props.m.content}`];
                    case "started":
                        return ["spa-chat-msg-log-alert", `Now chatting with ${props.m.with.name}`];
                }
            })();

        const onmounted =
            (e: R.RealEvent<HTMLElement>) => doScroll(e.currentTarget, e.currentTarget.parentElement!);

        return <div className={style} onMounted={onmounted}>{content}</div>;
    };

const mainContainer = (props: {currentUser: F0<User>, isLogonPending: F0<boolean>, processUser: A0}) => (
    <div className="spa">
        <div className="spa-shell-head">
            <div className="spa-shell-head-logo">
                <h1>SPA</h1>
                <p>typescript end to end</p>
            </div>
            <div className="spa-shell-head-acct" onClick={props.processUser}>
                {() => props.isLogonPending() ? "... processing ..." : props.currentUser.name}
            </div>
        </div>
        <div className="spa-shell-main">
            <div className="spa-shell-main-nav" > </div >
            <div className="spa-shell-main-content"></div>
        </div >
        <div className="spa-shell-foot"></div>
    </div>);

export const main: A0 =
    () => {

        const users = new VersionedList<User>();

        const messages = new VersionedList<Message>();

        const anonUser: User = { name: "'Please sign-in'" };

        let currentUser = anonUser;

        let chatee = anonUser;

        let isLogonPending = false;

        let isChatOpen = false;

        const isLoggedOn = () => currentUser !== anonUser;

        const simulateDataFeed =
            () => {

                const shouldCancel = () => !isLoggedOn();

                // simulate entry of users
                runTask(() => users.add({ name: "Betty" }), 1000, shouldCancel);

                runTask(() => users.add({ name: "Mike" }), 2000, shouldCancel);

                runTask(() => users.add({ name: "Pebbles" }), 3000, shouldCancel);

                runTask(() => users.add({ name: "Wilma" }), 4000, shouldCancel);

                // simulate receipt of message
                runTask(
                    () => {

                        const sender = users.getItem(3);

                        const simulatedReceipt: MessageFrom = {
                            kind: "from",
                            // tslint:disable-next-line:object-literal-sort-keys
                            from: sender,
                            content: `Hi there ${currentUser.name}!  ${sender.name} here.`,
                        };

                        if (chatee !== sender) {

                            chatee = sender;

                            const simulatedStart: ChatStarted = {
                                kind: "started",
                                with: sender,
                            };

                            messages.add(simulatedStart);
                        }

                        messages.add(simulatedReceipt);
                    },
                    5000,
                    shouldCancel,
                );
            };

        const logoff =
            () => {

                currentUser = anonUser;

                chatee = anonUser;

                messages.clear();

                users.clear();

                isChatOpen = false;
            };

        const logon =
            async (userName: string) => {

                isLogonPending = true;

                // simulate network delay
                await delay(1500, 0);

                isLogonPending = false;

                currentUser = { name: userName };

                isChatOpen = true;
            };

        const processUser =
            async () => {

                if (isLoggedOn()) {

                    logoff();

                    return;
                }

                const userName = prompt("Please sign-in");

                if (!notNullOrWhiteSpace(userName)) {
                    return;
                }

                await logon(userName);

                simulateDataFeed();
            };

        let sendingMessage = false;

        let messageContent = "";

        const submitMessage =
            async () => {

                if (!notNullOrWhiteSpace(messageContent) || !isLoggedOn() || chatee === anonUser) {
                    return;
                }

                const message: Message = {
                    kind: "to",
                    to: chatee,
                    // tslint:disable-next-line:object-literal-sort-keys
                    content: messageContent,
                };

                messages.add(message);

                messageContent = "";

                sendingMessage = true;

                // simulate transmission
                await delay(250, 0);

                sendingMessage = false;

                // simulate a message response
                const responseFrom = chatee;

                runTask(
                    () => {
                        const simulatedResponse: MessageFrom = {
                            kind: "from",
                            // tslint:disable-next-line:object-literal-sort-keys
                            from: responseFrom,
                            content: `Thanks for the note, ${currentUser.name}`,
                        };

                        messages.add(simulatedResponse);
                    },
                    1500,
                    () => !isLoggedOn(),
                );
            };

        const submitOnEnter =
            async (e: R.KeyboardEvent<HTMLInputElement>) => {

                if (e.keyCode !== ENTER_KEY) {
                    return;
                }

                await submitMessage();
            };

        const startChat =
            (user: User) => {
                chatee = user;

                const message: ChatStarted = {
                    kind: "started",
                    with: user,
                };

                messages.add(message);
            };

        const animateOpen = "spa-chat spa-chat-animate-open";

        const animateClose = "spa-chat spa-chat-animate-close";

        const isChatActive = () => isLoggedOn() && isChatOpen;

        const chatContainer =
            <div className={() => isChatActive() ? animateOpen : animateClose}>
                <div className="spa-chat-head">
                    <div className="spa-chat-head-toggle"
                        title={() => isChatOpen ? "Tap to close" : "Tap to open"}
                        onClick={() => isChatOpen = !isChatOpen}>
                        {() => isChatOpen ? "=" : "+"}
                    </div>
                    <div className="spa-chat-head-title">
                        {() => "Chat " + (chatee === anonUser ? "" : chatee.name)}
                    </div>
                    <div className="spa-chat-closer" onClick={() => isLoggedOn() && logoff()}>
                        x
                    </div>
                </div>
                <div className={() => isChatActive() ? "spa-chat-sizer" : "hidden"}>
                    <div className="spa-chat-list">
                        <div className="spa-chat-list-box">
                            <Template source={users}
                                template={(u) => userTemplate({
                                    user: u,
                                    chatee: () => chatee,
                                    startChat: (a) => startChat(a),
                                })}
                                placeholder={placeholderTemplate} />
                        </div>
                    </div>
                    <div className="spa-chat-msg">
                        <div className="spa-chat-msg-log">
                            <Template source={messages} template={(u) => messageTemplate({
                                m: u,
                                currentUser: () => currentUser,
                            })} />
                        </div>
                        <div className="spa-chat-msg-in" >
                            <TextBox
                                disabled={() => chatee === anonUser}
                                onTextChanged={(s) => messageContent = s}
                                onKeyUp={(s) => submitOnEnter(s)}
                                value={() => messageContent}
                                focus={() => true} />
                            <div className={() => "spa-chat-msg-send " + (sendingMessage ? selectedClass : "")}
                                onClick={submitMessage}>
                                send</div>
                        </div>
                    </div>
                </div>
            </div>;

        mainContainer({currentUser: () => currentUser,
                       isLogonPending: () => isLogonPending,
                       processUser: () => processUser()}).mount(document.body);

        chatContainer.mount(document.body);
    };

document.addEventListener("DOMContentLoaded", main, false);
