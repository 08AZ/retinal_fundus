import { type NextRequest, NextResponse } from "next/server"
const fetchCSRFToken = async () => {
  const res = await fetch("http://localhost:8000/csrf-token/", {
    method: "GET",
    credentials: "include", // 让浏览器携带 Cookies
  });
  const data = await res.json();
  return data.csrfToken;
};
export async function POST(request: NextRequest) {
  const body = await request.json()
  const csrfToken = await fetchCSRFToken();
  try {
    const response = await fetch("http://localhost:8000/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(body),
      credentials: "include",
    })
    if (!response.ok) {
      throw new Error("Login failed")
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ message: "登录失败，请检查您的账号和密码" }, { status: 401 })
  }
}

