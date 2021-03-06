import React from 'react';
import { Switch,Route } from 'react-router-dom';

import Main from './Main';
import Info from './Info';
import Password from './Password';
// import Focus from './Focus';
// import InterviewQuestion from './InterviewQuestion';
// import Answer from './Answer';
import MyList from './MyList';

function Index(props){
    let {match} = props;
    return (
        <Switch>
            <Route path={match.path+'/'} component={Main} exact/>
            <Route path={match.path+'/info'} component={Info}/>
            <Route path={match.path+'/password'} component={Password}/>
            <Route path={match.path+'/focus'} component={MyList}/>
            <Route path={match.path+'/iq'} component={MyList}/>
            <Route path={match.path+'/answer'} component={MyList}/>
        </Switch>
    )
}

export default Index;