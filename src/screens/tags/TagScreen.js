import React, { Component, useEffect, useState } from 'react';

import "./TagScreen.css";
import TitleBar from '../../comp/TitleBar';
import ExpensesAPI from '../../services/ExpensesAPI';
import Cookies from 'universal-cookie';
import TotoList from '../../comp/TotoList';

import { ReactComponent as TagSVG } from '../../img/tag.svg'
import TagsList from '../../comp/tag/TagsList';

const cookies = new Cookies()

export default function TagScreen(props) {

    return (
        <div className="tag-screen">
            <TitleBar title="Tags & Events" back={true} newEnabled={true} navigateTo="newTag" />

            <div className="list-container">
                <TagsList 
                />
            </div>
        </div>
    )
}