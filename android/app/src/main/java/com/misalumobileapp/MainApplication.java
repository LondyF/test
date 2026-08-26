package com.misalumobileapp;

import android.app.Application;
import android.content.res.Configuration;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactHost;
import com.facebook.react.ReactNativeApplicationEntryPoint;
import com.facebook.react.ReactPackage;
import expo.modules.ApplicationLifecycleDispatcher;
import expo.modules.ExpoReactHostFactory;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private ReactHost mReactHost;

  @Override
  public ReactHost getReactHost() {
    if (mReactHost == null) {
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for example:
      // packages.add(new MyReactNativePackage());
      mReactHost =
          ExpoReactHostFactory.getDefaultReactHost(
              getApplicationContext(),
              packages,
              ".expo/.virtual-metro-entry",
              "index.android.bundle",
              null,
              null,
              BuildConfig.DEBUG,
              null);
    }

    return mReactHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    ReactNativeApplicationEntryPoint.loadReactNative(this);
    ApplicationLifecycleDispatcher.onApplicationCreate(this);
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig);
  }
}
