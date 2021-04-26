/**
 * 
 * This is main script which u can just copy and paste in 
 * chrome's dev console to play bad apple on github's contrib graph
 * 
 * if you see error like 'content security policy' just install a chrome extension to disable it 
 * 
 * just like this one [ https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden ]
 * 
 * or disable content security by heading to about:config and search for content security (security.csp.enable) and set it to false
 * 
 *
 */

var ba_targ,ba_cnvs,ba_vid,
ba_ctx,
// ba_url="http://localhost:5500/Bad Apple.mp4" //for local test with vscode's live server
ba_url="http://localhost:8080/" //videoStreamer.php is running on it (u can also use any url with https://cors-anywhere.herokuapp.com for dealing with cors )
// ba_url="https://prashanth-kumar.herokuapp.com/"
,ba_vid_w,ba_vid_h,ba_vid_g_dim,ba_vid_cx,ba_vid_cy;
const grid_w=52,grid_h=52; //width and height of grids (px)

var el_arr=[]; //to speed up a bit first push the elements in a 2d array (like grid)
function start(){
    ba_cnvs=document.createElement("canvas");
    ba_ctx=ba_cnvs.getContext("2d");
    ba_vid=document.createElement("video");
    
    ba_vid.crossOrigin="Anonymous";

    ba_vid.src=ba_url;
    
    // target element
    ba_targ=document.querySelector(".js-calendar-graph-svg");
    ba_targ.setAttribute("width",grid_w*14); //14 and 13 are from svg (github follows this )
    ba_targ.setAttribute("height",grid_h*13); 
    ba_targ=ba_targ.children[0];
    window.removeEventListener("click",start);
    
    document.querySelector(".js-calendar-graph-svg").innerHTML=createElement(grid_w,grid_h);
    //initialize the grid
    for(var y=0;y<grid_h;y++){
        el_arr[y]=[];
        for(var x=0;x<grid_w;x++){
            el_arr[y].push(getElemAt(x,y));
        }
    }
    
    
    ba_vid.oncanplaythrough=playBadApple;
    
}

function playBadApple(){
    //// just for testing
    //// document.body.appendChild(ba_vid);
    //// document.body.appendChild(ba_cnvs);
    //// ba_vid.style.width="100%";
    //// ba_vid.style.width="100%";
    //// ba_vid.controls=1;
    //// ba_cnvs.style.width="100%";
    console.log("playing bad apple");
    //// --end

    ba_vid_w=ba_vid.videoWidth;
    ba_vid_h=ba_vid.videoHeight;
    ba_cnvs.width=grid_w;    
    ba_cnvs.height=grid_h;         
    ba_vid_g_dim=ba_vid_w>ba_vid_h?ba_vid_w:ba_vid_h;
    
    ba_vid.play();
    looper(); // ;)
}

function looper(){
    
    ba_ctx.drawImage(ba_vid,0,0,ba_vid_w,ba_vid_h,0,0,grid_w,grid_h);
    var data=ba_ctx.getImageData(0,0,grid_w,grid_h).data;
    
    for(var y=0;y<grid_h;y++){
        for(var x=0;x<grid_w;x++){
            var i=(y*grid_w+x)*4;
            //// var avg=data[i]+data[i+1]+data[i+2]; // use this if you want to play something else
            var avg=data[i]; //// we can use without average actually for bad apple
            var level=0;
            //// if(data[i]>=0 && data[i]<135) level=0;
            if(avg>=135 && avg < 270) level=1;
            if(avg>=270 && avg < 405) level=2;
            if(avg>=405 && avg < 540) level=3;
            if(avg>=540) level=4;
            el_arr[y][x].setAttribute("data-level",level)
        }
    }

    //request next frame
    if(!ba_vid.ended){
        var fps=25;
        setTimeout(looper,1000/fps);
        // requestAnimationFrame(looper); 
    } else {
        console.log("ended!");
    }
}

window.addEventListener("click",start);

// UTILS
function getElemAt(x,y){
    //// x+=19;//it starts from 19 //removed
    return document.querySelector(".js-calendar-graph-svg").children[0].children[x].children[y];
}

//for generating grid
function createElement(numx,numy){
    var svgs='<g transform="translate(10, 20)" data-hydro-click="{&quot;event_type&quot;:&quot;user_profile.click&quot;,&quot;payload&quot;:{&quot;profile_user_id&quot;:31966594,&quot;target&quot;:&quot;CONTRIBUTION_CALENDAR_SQUARE&quot;,&quot;user_id&quot;:null,&quot;originating_url&quot;:&quot;https://github.com/PrashanthKumar0&quot;}}" data-hydro-click-hmac="985fe0e983e1e20319d92d528a64a2a5a20bc3acf5cafd1cdccdf6a1f10085cb">';
    var cols='';
    
    for(var y=0;y<numy;y++){
        cols+='<rect width="10" height="10" x="14" y="'+(13*y)+'" class="ContributionCalendar-day" rx="2" ry="2" data-count="0" data-date="2020-04-26" data-level="0"></rect>';
    }
    
    for(var x=0;x<numx;x++){
        svgs+='<g transform="translate('+(14*x)+', 0)">'+cols+'</g>';          
    }
    //u can totally remove this ;)
    svgs+=`
            <text x="27" y="-7" class="ContributionCalendar-label">May</text>
            <text x="92" y="-7" class="ContributionCalendar-label">Jun</text>
            <text x="144" y="-7" class="ContributionCalendar-label">Jul</text>
            <text x="196" y="-7" class="ContributionCalendar-label">Aug</text>
            <text x="261" y="-7" class="ContributionCalendar-label">Sep</text>
            <text x="313" y="-7" class="ContributionCalendar-label">Oct</text>
            <text x="365" y="-7" class="ContributionCalendar-label">Nov</text>
            <text x="430" y="-7" class="ContributionCalendar-label">Dec</text>
            <text x="482" y="-7" class="ContributionCalendar-label">Jan</text>
            <text x="547" y="-7" class="ContributionCalendar-label">Feb</text>
            <text x="599" y="-7" class="ContributionCalendar-label">Mar</text>
            <text x="651" y="-7" class="ContributionCalendar-label">Apr</text>
            <text text-anchor="start" class="ContributionCalendar-label" dx="-10" dy="8" style="display: none;">Sun</text>
            <text text-anchor="start" class="ContributionCalendar-label" dx="-10" dy="22">Mon</text>
            <text text-anchor="start" class="ContributionCalendar-label" dx="-10" dy="32" style="display: none;">Tue</text>
            <text text-anchor="start" class="ContributionCalendar-label" dx="-10" dy="48">Wed</text>
            <text text-anchor="start" class="ContributionCalendar-label" dx="-10" dy="57" style="display: none;">Thu</text>
            <text text-anchor="start" class="ContributionCalendar-label" dx="-10" dy="73">Fri</text>
            <text text-anchor="start" class="ContributionCalendar-label" dx="-10" dy="81" style="display: none;">Sat</text>
    `;

    //dont remove this its a closing tag
    svgs+="</g>";
    return svgs;
}