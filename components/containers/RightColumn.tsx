import ChatList from "./Chats/ChatList"

const RightColumn = () => {
  return (
    <div className="flex sm:flex-col px-2">
      <div className="rounded-xl border border-primary-focus mb-3 w-full bg-primary">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:py-12 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-content">
            Made with Tailwind
          </h2>
        </div>
      </div>
      <ChatList />
    </div>
  )
}

export default RightColumn
