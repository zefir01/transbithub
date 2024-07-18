import React, {useEffect, useState} from 'react';
import {Redirect, useRouteMatch} from 'react-router-dom';
import {MyDecimal} from "../MyDecimal";
import {useDispatch} from "redux-react-hook";
import {SetAdId, SetBuyAmount, SetCurrentPath, SetInvoiceId, SetInvoicePieces, SetOperation} from "../redux/actions";
import {HelperOperation} from "../redux/store/Interfaces";


export function LinksManager() {
    const dispatch = useDispatch();
    const matchInvoice = useRouteMatch('/links/invoice/:id/:pieces?');
    const matchInvoiceHelper = useRouteMatch('/links/helper/invoice/:id/:pieces?');
    const matchAd = useRouteMatch('/links/advertisement/:id/:amount?');
    const matchAdHelper = useRouteMatch('/links/helper/advertisement/:id/:amount?');
    const [redirect, setRedirect] = useState("");

    useEffect(() => {
        if (matchInvoice) {
            // @ts-ignore
            let idStr: string | undefined = matchInvoice.params.id;
            // @ts-ignore
            let piecesStr: string | undefined = matchInvoice.params.pieces;
            if (idStr === undefined || idStr === "") {
                return;
            }
            let id = parseInt(idStr);
            if (isNaN(id)) {
                return;
            }
            if (piecesStr !== undefined && piecesStr !== "") {
                let pieces = new MyDecimal(piecesStr);
                setRedirect(`/invoices/invoice/${id}/${pieces}`);
            } else {
                setRedirect(`/invoices/invoice/${id}`);
            }
        } else if (matchInvoiceHelper) {
            // @ts-ignore
            let idStr: string | undefined = matchInvoiceHelper.params.id;
            // @ts-ignore
            let piecesStr: string | undefined = matchInvoiceHelper.params.pieces;
            if (idStr === undefined || idStr === "") {
                return;
            }
            let id = parseInt(idStr);
            if (isNaN(id)) {
                return;
            }
            dispatch(SetInvoiceId(id));
            if (piecesStr !== undefined && piecesStr !== "") {
                let pieces = parseInt(piecesStr);
                if (!isNaN(pieces)) {
                    dispatch(SetInvoicePieces(pieces));
                }
            }
            else{
                dispatch(SetInvoicePieces(1));
            }
            dispatch(SetOperation(HelperOperation.PayInvoice));
            dispatch(SetCurrentPath("/helper/selectPaymentType"));
            setRedirect(`/helper/selectPaymentType`);
        } else if (matchAd) {
            // @ts-ignore
            let idStr: string | undefined = matchAd.params.id;
            // @ts-ignore
            let amountStr: string | undefined = matchAd.params.amount;
            if (idStr === undefined || idStr === "") {
                return;
            }
            let id = parseInt(idStr);
            if (isNaN(id)) {
                return;
            }
            let amount: MyDecimal | null = null;
            if (amountStr !== undefined && amountStr !== "") {
                amount=new MyDecimal(amountStr);
                amount=new MyDecimal(amount.toDecimalPlaces(2));
            }
            if(amount){
                setRedirect(`/createDeal/${id}/${amount.toString()}`);
            }
            else {
                setRedirect(`/createDeal/${id}`);
            }

        } else if(matchAdHelper){
            // @ts-ignore
            let idStr: string | undefined = matchAdHelper.params.id;
            // @ts-ignore
            let amountStr: string | undefined = matchAdHelper.params.amount;
            if (idStr === undefined || idStr === "") {
                return;
            }
            let id = parseInt(idStr);
            if (isNaN(id)) {
                return;
            }
            let amount: MyDecimal | null = null;
            if (amountStr !== undefined && amountStr !== "") {
                amount=new MyDecimal(amountStr);
                amount=new MyDecimal(amount.toDecimalPlaces(2));
            }
            dispatch(SetOperation(HelperOperation.BuyBtc));
            dispatch(SetCurrentPath("/helper/selectBuyResult"));
            dispatch(SetAdId(id));
            if(amount){
                dispatch(SetBuyAmount(amount, true));
            }
            setRedirect(`/helper/selectBuyResult`);
        }
    }, [matchInvoice, matchInvoiceHelper, dispatch, matchAd, matchAdHelper]);

    if (redirect !== "") {
        return <Redirect push to={redirect}/>
    }

    return null;
}