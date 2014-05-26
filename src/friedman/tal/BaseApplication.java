package friedman.tal;

import java.util.Collections;
import java.util.Set;

import javax.ws.rs.core.Application;

public class BaseApplication extends Application {

	private Set<Object> _myAppSingeltons;
	private Set<Class<?>> _myPerRequestClasses;	
	
	protected void setSingletons(Set<Object> aSingletonsSet) {
		this._myAppSingeltons = Collections.unmodifiableSet(aSingletonsSet);
	}
	
	protected void setClasses(Set<Class<?>> aClassesSet) {
		this._myPerRequestClasses = Collections.unmodifiableSet(aClassesSet);
	}
	

	@Override
	public Set<Object> getSingletons() {
		return this._myAppSingeltons;
	}

	@Override
	public Set<Class<?>> getClasses() {
		return this._myPerRequestClasses;
	}

}