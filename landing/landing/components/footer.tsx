import Link from "next/link";
import React from "react";

export function Footer() {
    return (
        <footer style={{background: "#2979F2", marginTop: "272px", padding: "padding: 50px 0"}}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-5 me-auto">
                        <Link href="/" passHref>
                            <a className="footer-logo">
                                <span>trans<span style={{color: "#FFAB09"}}>bit</span>hub</span>
                            </a>
                        </Link>
                        <div className="footer-support d-flex flex-column">
                            <span>Поддержка:</span>
                            <Link href="mailto:support@transbithub.com" passHref>
                                <a>support@transbithub.com</a>
                            </Link>
                        </div>
                    </div>
                    <div className="col-12 col-lg-auto">
                        <Link href="/docs-static/" passHref>
                            <a className="btn btn-outline-white btn-new btn-menu btn-menu-light">
                                Документация
                            </a>
                        </Link>
                        <Link href="/blog/blog" passHref>
                            <a className="btn btn-outline-white btn-new btn-menu btn-menu-light">
                                Блог
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}