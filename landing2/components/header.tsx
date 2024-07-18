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
                        {!process.env.NEXT_PUBLIC_AGGREGATOR_DISABLE ?
                            <Link href="/aggregator/find" passHref>
                                <a className="btn btn-outline-primary btn-new btn-menu">
                                    Агрегатор
                                </a>
                            </Link>
                            : null
                        }
                        <a href="/docs-static/" className="btn btn-outline-primary btn-new btn-menu">
                            Документация
                        </a>
                        <Link href="/blog" passHref>
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