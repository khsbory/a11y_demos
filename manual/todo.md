### 1\. `Layout` 컴포넌트 (`.tsx`)

`children` prop에 대한 타입을 명시해 줍니다. 리액트 컴포넌트를 자식으로 받기 때문에 `React.ReactNode` 타입을 사용합니다.

💻 **`components/Layout.tsx`**

```tsx
import React from 'react';
import Header from './Header';

// children prop의 타입을 지정합니다.
type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
```

-----

### 2\. `Header` 컴포넌트 (`.tsx`)

이 컴포넌트는 별도의 props를 받지 않지만, `React.FC` (Functional Component) 타입을 명시하여 컴포넌트임을 명확히 합니다. `useState`의 타입은 타입스크립트가 `boolean`으로 잘 추론하므로 명시적으로 선언할 필요는 없습니다.

💻 **`components/Header.tsx`**

```tsx
import React, { useState } from 'react';

const Header: React.FC = () => {
  // const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  // 위와 같이 타입을 명시할 수 있지만, TypeScript가 boolean으로 타입을 추론합니다.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems: string[] = ['데모 1', '데모 2', '소개'];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-gray-800">
          웹 접근성 데모
        </h1>

        <nav className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <a
              key={item}
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 focus:outline-none"
            aria-label="메뉴 열기"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col items-center p-4 space-y-4">
            {menuItems.map((item) => (
              <a
                key={item}
                href="#"
                className="block text-gray-600 hover:text-blue-600 w-full text-center"
              >
                {item}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
```

-----

### 3\. `DemoPage` 컴포넌트 (`.tsx`)

마찬가지로 `React.FC`를 사용하여 타입스크립트 컴포넌트로 만듭니다.

💻 **`pages/DemoPage.tsx`**

```tsx
import React from 'react';

const DemoPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4 border-b pb-2">
          VoiceOver 포커스 분리 현상 데모
        </h2>
        <p className="text-gray-700 leading-relaxed">
          이 영역에 iOS VoiceOver에서 `<a>` 태그 내부에 여러 스타일(e.g., `<strong>`, `<span>`)을 가진 자식 요소가 있을 때, 포커스가 분리되어 각 요소별로 읽어주는 현상을 재현하는 데모 콘텐츠가 위치할 예정입니다.
        </p>
        
        <div className="mt-8 border-t pt-6">
          <p className="text-lg font-semibold">데모 영역</p>
          <div className="mt-4 p-4 border rounded">
            (여기에 실제 데모 UI를 구현합니다.)
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
```

-----

### 4\. `App.tsx` (조합 및 사용법)

최상위 컴포넌트 역시 `React.FC`를 적용합니다.

💻 **`App.tsx`**

```tsx
import React from 'react';
import Layout from './components/Layout';
import DemoPage from './pages/DemoPage';

const App: React.FC = () => {
  return (
    <Layout>
      <DemoPage />
    </Layout>
  );
}

export default App;
```

이제 이 코드들을 개발자에게 전달하시면 타입스크립트 환경에서 바로 작업을 시작할 수 있을 겁니다.