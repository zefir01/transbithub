import Link from "next/link";
import React from "react";

export function Header() {
    return (
        <div className="header">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-lg-auto me-auto">
                        <Link href="/" passHref>
                            <a className="header-logo">
                                <span>trans<span style={{color: "#FFAB09"}}>bit</span>hub</span>
                            </a>
                        </Link>
                    </div>
                    <div className="col-12 col-lg-auto">
                        <Link href="/docs-static/" passHref>
                            <a className="btn btn-outline-primary btn-new btn-menu">
                                Документация
                            </a>
                        </Link>
                        <Link href="/blog/blog" passHref>
                            <a className="btn btn-outline-primary btn-new btn-menu">
                                Блог
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}