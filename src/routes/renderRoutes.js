import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

function renderRoutes(routes, extraProps = {}, switchProps = {}) {
    return routes ? (
        <Suspense fallback={<div>loading......</div>}>
            <Switch {...switchProps}>
                {routes.map((route, i) => {
                    return (
                        <Route
                            key={route.key || i}
                            path={route.path}
                            exact={route.exact}
                            strict={route.strict}
                            render={props =>
                                route.render ? (
                                    route.render({ ...props, ...extraProps, route: route.routes })
                                ) : (
                                    <route.component {...props} {...extraProps} route={route.routes} />
                                )
                            }
                        />
                    )
                })}
            </Switch>
        </Suspense>
    ) : null;
}

export default renderRoutes