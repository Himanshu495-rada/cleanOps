package com.spoorthy_app;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

import org.devio.rn.splashscreen.SplashScreen; // here

public class MainActivity extends ReactActivity {

  @Override
  protected String getMainComponentName() {
    return "Spoorthy_app";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
    );
  }

  // @Override
  // protected void onCreate(Bundle savedInstanceState) {
  //   SplashScreen.show(this); // here
  //   super.onCreate(savedInstanceState);
  // }
}
